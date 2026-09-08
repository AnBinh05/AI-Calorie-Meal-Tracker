package com.calorie.tracker.controller;

import com.calorie.tracker.dto.request.CreateMealRequest;
import com.calorie.tracker.dto.request.UpdateMealRequest;
import com.calorie.tracker.dto.response.ApiResponse;
import com.calorie.tracker.dto.response.MealAnalysisResponse;
import com.calorie.tracker.dto.response.MealDto;
import com.calorie.tracker.service.GeminiVisionService;
import com.calorie.tracker.service.MealService;
import com.calorie.tracker.service.StorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/meals")
@RequiredArgsConstructor
@Tag(name = "3. Meals & AI Analysis", description = "Phân tích ảnh món ăn bằng Gemini AI và quản lý nhật ký bữa ăn")
public class MealController {

    private final MealService mealService;
    private final GeminiVisionService geminiVisionService;
    private final StorageService storageService;

    @PostMapping(value = "/analyze", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload ảnh bữa ăn và phân tích dinh dưỡng qua Gemini Flash Vision API")
    public ResponseEntity<ApiResponse<MealAnalysisResponse>> analyzeMealImage(
            @RequestParam("image") MultipartFile image
    ) {
        String storedImageUrl = storageService.storeFile(image);
        MealAnalysisResponse analysis = geminiVisionService.analyzeMealImage(image, storedImageUrl);
        return ResponseEntity.ok(ApiResponse.ok("Phân tích món ăn thành công", analysis));
    }

    @PostMapping
    @Operation(summary = "Lưu bữa ăn đã xác nhận vào nhật ký")
    public ResponseEntity<ApiResponse<MealDto>> createMeal(@Valid @RequestBody CreateMealRequest request) {
        MealDto mealDto = mealService.createMeal(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Lưu bữa ăn thành công", mealDto));
    }

    @GetMapping("/daily")
    @Operation(summary = "Lấy danh sách các bữa ăn theo ngày (mặc định hôm nay)")
    public ResponseEntity<ApiResponse<List<MealDto>>> getDailyMeals(
            @RequestParam(value = "date", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        List<MealDto> meals = mealService.getMealsByDate(date);
        return ResponseEntity.ok(ApiResponse.ok(meals));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy chi tiết một bữa ăn theo ID")
    public ResponseEntity<ApiResponse<MealDto>> getMealById(@PathVariable Long id) {
        MealDto mealDto = mealService.getMealById(id);
        return ResponseEntity.ok(ApiResponse.ok(mealDto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật thông tin bữa ăn")
    public ResponseEntity<ApiResponse<MealDto>> updateMeal(
            @PathVariable Long id,
            @Valid @RequestBody UpdateMealRequest request
    ) {
        MealDto mealDto = mealService.updateMeal(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật bữa ăn thành công", mealDto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa một bữa ăn")
    public ResponseEntity<ApiResponse<Void>> deleteMeal(@PathVariable Long id) {
        mealService.deleteMeal(id);
        return ResponseEntity.ok(ApiResponse.ok("Xóa bữa ăn thành công", null));
    }
}
