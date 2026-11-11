package com.calorie.tracker.service;

import com.calorie.tracker.entity.HealthProfile;
import com.calorie.tracker.entity.Meal;
import com.calorie.tracker.entity.MealItem;
import com.calorie.tracker.entity.User;
import com.calorie.tracker.repository.HealthProfileRepository;
import com.calorie.tracker.repository.MealRepository;
import com.lowagie.text.*;
import com.lowagie.text.pdf.BaseFont;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.text.Normalizer;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ExportService {

    private static final List<String> UNICODE_FONT_CANDIDATES = List.of(
            "C:/Windows/Fonts/arial.ttf",
            "C:/Windows/Fonts/segoeui.ttf",
            "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
            "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
    );

    private final MealRepository mealRepository;
    private final HealthProfileRepository healthProfileRepository;
    private final UserService userService;

    public byte[] exportToCsv(LocalDate startDate, LocalDate endDate) {
        User user = userService.getCurrentAuthenticatedUser();
        LocalDate start = (startDate != null) ? startDate : LocalDate.now().minusDays(30);
        LocalDate end = (endDate != null) ? endDate : LocalDate.now();
        if (start.isAfter(end)) {
            LocalDate tmp = start;
            start = end;
            end = tmp;
        }

        List<Meal> meals = mealRepository.findByUserIdAndMealDateBetweenOrderByMealDateAscCreatedAtAsc(user.getId(), start, end);

        try (ByteArrayOutputStream out = new ByteArrayOutputStream();
             CSVPrinter csvPrinter = new CSVPrinter(new OutputStreamWriter(out, StandardCharsets.UTF_8),
                     CSVFormat.DEFAULT.builder()
                             .setHeader("Ngay", "Loai_Bua_An", "Ten_Bua_An", "Mon_An", "Khoi_Luong_g", "Calories", "Protein_g", "Carbs_g", "Fat_g", "Ghi_Chu")
                             .build())) {

            // UTF-8 BOM for Excel compatibility
            out.write(0xEF);
            out.write(0xBB);
            out.write(0xBF);

            for (Meal meal : meals) {
                if (meal.getItems() != null && !meal.getItems().isEmpty()) {
                    for (MealItem item : meal.getItems()) {
                        csvPrinter.printRecord(
                                meal.getMealDate().toString(),
                                meal.getMealType().getDisplayName(),
                                meal.getName(),
                                item.getName(),
                                item.getEstimatedWeightGrams() != null ? item.getEstimatedWeightGrams() : "",
                                item.getCalories(),
                                item.getProtein() != null ? item.getProtein() : 0.0,
                                item.getCarbs() != null ? item.getCarbs() : 0.0,
                                item.getFat() != null ? item.getFat() : 0.0,
                                meal.getNotes() != null ? meal.getNotes() : ""
                        );
                    }
                } else {
                    csvPrinter.printRecord(
                            meal.getMealDate().toString(),
                            meal.getMealType().getDisplayName(),
                            meal.getName(),
                            "",
                            "",
                            meal.getTotalCalories(),
                            meal.getTotalProtein(),
                            meal.getTotalCarbs(),
                            meal.getTotalFat(),
                            meal.getNotes() != null ? meal.getNotes() : ""
                    );
                }
            }
            csvPrinter.flush();
            return out.toByteArray();
        } catch (IOException e) {
            log.error("Lỗi khi tạo file CSV: {}", e.getMessage());
            throw new RuntimeException("Không thể xuất báo cáo CSV", e);
        }
    }

    public byte[] exportToPdf(LocalDate startDate, LocalDate endDate) {
        User user = userService.getCurrentAuthenticatedUser();
        LocalDate start = (startDate != null) ? startDate : LocalDate.now().minusDays(30);
        LocalDate end = (endDate != null) ? endDate : LocalDate.now();
        if (start.isAfter(end)) {
            LocalDate tmp = start;
            start = end;
            end = tmp;
        }

        List<Meal> meals = mealRepository.findByUserIdAndMealDateBetweenOrderByMealDateAscCreatedAtAsc(user.getId(), start, end);
        HealthProfile profile = healthProfileRepository.findByUser(user).orElse(null);

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4, 36, 36, 36, 36);
            PdfWriter.getInstance(document, out);
            document.open();

            PdfFontPack fonts = resolvePdfFonts();

            // Document Header
            Paragraph title = new Paragraph(formatPdfText("BÁO CÁO DINH DƯỠNG & NHẬT KÝ BỮA ĂN", fonts.unicodeSupported), fonts.titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            Paragraph subTitle = new Paragraph(formatPdfText(String.format("Người dùng: %s (%s) | Từ %s đến %s",
                    user.getFullName(), user.getEmail(),
                    start.format(DateTimeFormatter.ISO_DATE),
                    end.format(DateTimeFormatter.ISO_DATE)), fonts.unicodeSupported), fonts.subTitleFont);
            subTitle.setAlignment(Element.ALIGN_CENTER);
            subTitle.setSpacingAfter(12);
            document.add(subTitle);

            // Health Profile Summary (BMR / TDEE / Targets)
            if (profile != null) {
                String profileLine = String.format(
                        "Chỉ số thể trạng: BMR %d kcal | TDEE %d kcal | Mục tiêu ngày: %d kcal (P: %dg • C: %dg • F: %dg)",
                        profile.getBmr() != null ? profile.getBmr() : 0,
                        profile.getTdee() != null ? profile.getTdee() : 0,
                        profile.getDailyCalorieTarget() != null ? profile.getDailyCalorieTarget() : 2000,
                        profile.getDailyProteinTargetGrams() != null ? profile.getDailyProteinTargetGrams() : 150,
                        profile.getDailyCarbsTargetGrams() != null ? profile.getDailyCarbsTargetGrams() : 225,
                        profile.getDailyFatTargetGrams() != null ? profile.getDailyFatTargetGrams() : 55
                );
                Paragraph profilePara = new Paragraph(formatPdfText(profileLine, fonts.unicodeSupported), fonts.boldFont);
                profilePara.setSpacingAfter(14);
                document.add(profilePara);
            }

            // Table (7 columns including Fat)
            PdfPTable table = new PdfPTable(7);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{2.1f, 1.8f, 3.3f, 1.6f, 1.6f, 1.6f, 1.5f});

            String[] headers = {"Ngày", "Bữa ăn", "Tên món", "Calo", "Protein(g)", "Carbs(g)", "Fat(g)"};
            for (String header : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(formatPdfText(header, fonts.unicodeSupported), fonts.headerFont));
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                cell.setBackgroundColor(new Color(16, 185, 129));
                cell.setPadding(6);
                table.addCell(cell);
            }

            double sumCalories = 0;
            double sumProtein = 0;
            double sumCarbs = 0;
            double sumFat = 0;
            for (Meal meal : meals) {
                double cal = meal.getTotalCalories() != null ? meal.getTotalCalories() : 0.0;
                double pro = meal.getTotalProtein() != null ? meal.getTotalProtein() : 0.0;
                double carb = meal.getTotalCarbs() != null ? meal.getTotalCarbs() : 0.0;
                double fat = meal.getTotalFat() != null ? meal.getTotalFat() : 0.0;
                sumCalories += cal;
                sumProtein += pro;
                sumCarbs += carb;
                sumFat += fat;

                table.addCell(new Phrase(meal.getMealDate().toString(), fonts.bodyFont));
                table.addCell(new Phrase(formatPdfText(meal.getMealType() != null ? meal.getMealType().getDisplayName() : "-", fonts.unicodeSupported), fonts.bodyFont));
                table.addCell(new Phrase(formatPdfText(meal.getName() != null ? meal.getName() : "-", fonts.unicodeSupported), fonts.bodyFont));
                table.addCell(new Phrase(String.format("%.1f", cal), fonts.bodyFont));
                table.addCell(new Phrase(String.format("%.1f", pro), fonts.bodyFont));
                table.addCell(new Phrase(String.format("%.1f", carb), fonts.bodyFont));
                table.addCell(new Phrase(String.format("%.1f", fat), fonts.bodyFont));
            }

            document.add(table);

            long totalDays = Math.max(1, ChronoUnit.DAYS.between(start, end) + 1);
            double avgDailyCalories = sumCalories / totalDays;
            Paragraph summary = new Paragraph(formatPdfText(String.format(
                    "\nTổng số bữa ăn: %d | Tổng năng lượng: %.1f kcal (TB %.1f kcal/ngày) | Tổng Macros: P %.1fg • C %.1fg • F %.1fg",
                    meals.size(), sumCalories, avgDailyCalories, sumProtein, sumCarbs, sumFat), fonts.unicodeSupported), fonts.boldFont);
            summary.setSpacingBefore(12);
            document.add(summary);

            int targetCal = profile != null && profile.getDailyCalorieTarget() != null ? profile.getDailyCalorieTarget() : 2000;
            String recommendation;
            if (meals.isEmpty()) {
                recommendation = "Khuyến nghị NutriAI: Chưa có bữa ăn được ghi nhận trong khoảng thời gian này. Hãy duy trì chụp ảnh và ghi chép hằng ngày để theo dõi tiến độ chính xác.";
            } else if (avgDailyCalories > targetCal * 1.1) {
                recommendation = String.format("Khuyến nghị NutriAI: Lượng calo trung bình (%.0f kcal/ngày) đang cao hơn mục tiêu (%d kcal). Nên giảm nhẹ tinh bột tinh chế và tăng rau xanh trong bữa tối.", avgDailyCalories, targetCal);
            } else if (avgDailyCalories < targetCal * 0.85) {
                recommendation = String.format("Khuyến nghị NutriAI: Lượng calo trung bình (%.0f kcal/ngày) đang thấp hơn mục tiêu (%d kcal). Hãy bổ sung thêm đạm nạc và chất béo lành mạnh để đủ năng lượng.", avgDailyCalories, targetCal);
            } else {
                recommendation = String.format("Khuyến nghị NutriAI: Lượng calo trung bình (%.0f kcal/ngày) bám sát mục tiêu (%d kcal). Hãy tiếp tục duy trì thói quen ăn uống cân bằng và uống đủ nước.", avgDailyCalories, targetCal);
            }
            Paragraph advicePara = new Paragraph(formatPdfText(recommendation, fonts.unicodeSupported), fonts.subTitleFont);
            advicePara.setSpacingBefore(8);
            document.add(advicePara);

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            log.error("Lỗi khi tạo file PDF: {}", e.getMessage());
            throw new RuntimeException("Không thể xuất báo cáo PDF", e);
        }
    }

    private PdfFontPack resolvePdfFonts() {
        for (String fontPath : UNICODE_FONT_CANDIDATES) {
            try {
                if (Files.exists(Path.of(fontPath))) {
                    BaseFont baseFont = BaseFont.createFont(fontPath, BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
                    Font titleFont = new Font(baseFont, 16, Font.BOLD, new Color(15, 23, 42));
                    Font subTitleFont = new Font(baseFont, 10, Font.NORMAL, new Color(71, 85, 105));
                    Font headerFont = new Font(baseFont, 9, Font.BOLD, Color.WHITE);
                    Font boldFont = new Font(baseFont, 10, Font.BOLD, new Color(15, 23, 42));
                    Font bodyFont = new Font(baseFont, 9, Font.NORMAL, new Color(15, 23, 42));
                    return new PdfFontPack(true, titleFont, subTitleFont, headerFont, boldFont, bodyFont);
                }
            } catch (Exception ignored) {
                // Try next font candidate
            }
        }
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16);
        Font subTitleFont = FontFactory.getFont(FontFactory.HELVETICA, 10);
        Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, Color.WHITE);
        Font boldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10);
        Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 9);
        return new PdfFontPack(false, titleFont, subTitleFont, headerFont, boldFont, bodyFont);
    }

    private String formatPdfText(String text, boolean unicodeSupported) {
        if (text == null || unicodeSupported) {
            return text;
        }
        String normalized = Normalizer.normalize(text, Normalizer.Form.NFD)
                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
        return normalized.replace('đ', 'd').replace('Đ', 'D');
    }

    private record PdfFontPack(
            boolean unicodeSupported,
            Font titleFont,
            Font subTitleFont,
            Font headerFont,
            Font boldFont,
            Font bodyFont
    ) {}
}
