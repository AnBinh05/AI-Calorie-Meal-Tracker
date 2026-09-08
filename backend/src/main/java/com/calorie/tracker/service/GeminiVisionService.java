package com.calorie.tracker.service;

import com.calorie.tracker.dto.response.MealAnalysisResponse;
import com.calorie.tracker.dto.response.MealItemDto;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class GeminiVisionService {

    @Value("${gemini.api-key:}")
    private String apiKey;

    @Value("${gemini.model:gemini-1.5-flash}")
    private String modelName;

    @Value("${gemini.api-url:https://generativelanguage.googleapis.com/v1beta/models}")
    private String apiUrl;

    private final ObjectMapper objectMapper;
    private final RestTemplate restTemplate = new RestTemplate();

    public MealAnalysisResponse analyzeMealImage(MultipartFile imageFile, String imageUrl) {
        if (apiKey == null || apiKey.isBlank() || apiKey.equals("demo_gemini_api_key")) {
            log.warn("Gemini API key chưa được cấu hình. Sử dụng dữ liệu mô phỏng thông minh cho phát triển...");
            return getFallbackAnalysis(imageUrl);
        }

        try {
            byte[] imageBytes = imageFile.getBytes();
            String base64Image = Base64.getEncoder().encodeToString(imageBytes);
            String mimeType = imageFile.getContentType() != null ? imageFile.getContentType() : "image/jpeg";

            String prompt = """
                    Bạn là một chuyên gia dinh dưỡng và thị giác máy tính AI. Hãy phân tích bức ảnh món ăn này một cách chi tiết và ước tính dinh dưỡng.
                    Trả về kết quả DUY NHẤT dưới dạng cấu trúc JSON hợp lệ (không kèm markdown thừa, không giải thích ngoài JSON) theo mẫu sau:
                    {
                      "suggestedMealName": "Tên tổng quan bữa ăn",
                      "estimatedTotalCalories": 650.0,
                      "estimatedTotalProtein": 35.0,
                      "estimatedTotalCarbs": 70.0,
                      "estimatedTotalFat": 22.0,
                      "healthTip": "Lời khuyên dinh dưỡng hữu ích và thân thiện cho bữa ăn này",
                      "recognizedItems": [
                        {
                          "name": "Tên món / thành phần 1",
                          "estimatedWeightGrams": 150.0,
                          "servingSize": "1 bát nhỏ",
                          "calories": 200.0,
                          "protein": 5.0,
                          "carbs": 40.0,
                          "fat": 1.0,
                          "fiber": 2.0,
                          "confidenceScore": 0.95
                        }
                      ]
                    }
                    """;

            String requestUrl = String.format("%s/%s:generateContent?key=%s", apiUrl, modelName, apiKey);

            Map<String, Object> imagePart = Map.of(
                    "inline_data", Map.of(
                            "mime_type", mimeType,
                            "data", base64Image
                    )
            );
            Map<String, Object> textPart = Map.of("text", prompt);

            Map<String, Object> contents = Map.of(
                    "parts", List.of(textPart, imagePart)
            );

            Map<String, Object> requestBody = Map.of(
                    "contents", List.of(contents),
                    "generationConfig", Map.of(
                            "temperature", 0.2,
                            "topK", 32,
                            "topP", 1.0,
                            "maxOutputTokens", 2048
                    )
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(requestUrl, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return parseGeminiResponse(response.getBody(), imageUrl);
            } else {
                log.error("Lỗi từ Gemini API: Status {}", response.getStatusCode());
                return getFallbackAnalysis(imageUrl);
            }
        } catch (Exception e) {
            log.error("Lỗi phân tích Gemini Vision: {}", e.getMessage(), e);
            return getFallbackAnalysis(imageUrl);
        }
    }

    private MealAnalysisResponse parseGeminiResponse(String responseJson, String imageUrl) {
        try {
            JsonNode root = objectMapper.readTree(responseJson);
            JsonNode candidates = root.path("candidates");
            if (candidates.isArray() && !candidates.isEmpty()) {
                JsonNode parts = candidates.get(0).path("content").path("parts");
                if (parts.isArray() && !parts.isEmpty()) {
                    String rawText = parts.get(0).path("text").asText();
                    String cleanedJson = cleanJsonString(rawText);

                    MealAnalysisResponse analysisResponse = objectMapper.readValue(cleanedJson, MealAnalysisResponse.class);
                    analysisResponse.setImageUrl(imageUrl);
                    analysisResponse.setRawAiResponse(rawText);
                    return analysisResponse;
                }
            }
        } catch (Exception e) {
            log.error("Lỗi parse JSON từ Gemini response: {}", e.getMessage());
        }
        return getFallbackAnalysis(imageUrl);
    }

    private String cleanJsonString(String raw) {
        String trimmed = raw.trim();
        if (trimmed.startsWith("```json")) {
            trimmed = trimmed.substring(7);
        } else if (trimmed.startsWith("```")) {
            trimmed = trimmed.substring(3);
        }
        if (trimmed.endsWith("```")) {
            trimmed = trimmed.substring(0, trimmed.length() - 3);
        }
        return trimmed.trim();
    }

    private MealAnalysisResponse getFallbackAnalysis(String imageUrl) {
        List<MealItemDto> mockItems = List.of(
                MealItemDto.builder()
                        .name("Cơm trắng")
                        .estimatedWeightGrams(150.0)
                        .servingSize("1 bát vừa")
                        .calories(195.0)
                        .protein(4.2)
                        .carbs(43.5)
                        .fat(0.4)
                        .fiber(0.6)
                        .confidenceScore(0.95)
                        .build(),
                MealItemDto.builder()
                        .name("Ức gà nướng thảo mộc")
                        .estimatedWeightGrams(150.0)
                        .servingSize("1 miếng lớn")
                        .calories(247.5)
                        .protein(46.5)
                        .carbs(0.0)
                        .fat(5.4)
                        .fiber(0.0)
                        .confidenceScore(0.92)
                        .build(),
                MealItemDto.builder()
                        .name("Salad rau củ & dầu ô liu")
                        .estimatedWeightGrams(100.0)
                        .servingSize("1 đĩa nhỏ")
                        .calories(85.0)
                        .protein(1.8)
                        .carbs(6.5)
                        .fat(6.0)
                        .fiber(2.8)
                        .confidenceScore(0.89)
                        .build()
        );

        double totalCalories = mockItems.stream().mapToDouble(MealItemDto::getCalories).sum();
        double totalProtein = mockItems.stream().mapToDouble(MealItemDto::getProtein).sum();
        double totalCarbs = mockItems.stream().mapToDouble(MealItemDto::getCarbs).sum();
        double totalFat = mockItems.stream().mapToDouble(MealItemDto::getFat).sum();

        return MealAnalysisResponse.builder()
                .suggestedMealName("Cơm ức gà nướng kèm Salad rau củ")
                .imageUrl(imageUrl)
                .estimatedTotalCalories(Math.round(totalCalories * 10.0) / 10.0)
                .estimatedTotalProtein(Math.round(totalProtein * 10.0) / 10.0)
                .estimatedTotalCarbs(Math.round(totalCarbs * 10.0) / 10.0)
                .estimatedTotalFat(Math.round(totalFat * 10.0) / 10.0)
                .healthTip("Bữa ăn rất cân đối! Hàm lượng protein cao hỗ trợ phục hồi và phát triển cơ bắp, kèm chất xơ dồi dào từ rau xanh giúp hệ tiêu hóa khỏe mạnh.")
                .recognizedItems(mockItems)
                .rawAiResponse("DEMO_FALLBACK_ANALYSIS")
                .build();
    }
}
