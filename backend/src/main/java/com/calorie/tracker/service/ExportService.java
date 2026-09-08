package com.calorie.tracker.service;

import com.calorie.tracker.entity.Meal;
import com.calorie.tracker.entity.MealItem;
import com.calorie.tracker.entity.User;
import com.calorie.tracker.repository.MealRepository;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExportService {

    private final MealRepository mealRepository;
    private final UserService userService;

    public byte[] exportToCsv(LocalDate startDate, LocalDate endDate) {
        User user = userService.getCurrentAuthenticatedUser();
        LocalDate start = (startDate != null) ? startDate : LocalDate.now().minusDays(30);
        LocalDate end = (endDate != null) ? endDate : LocalDate.now();

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

        List<Meal> meals = mealRepository.findByUserIdAndMealDateBetweenOrderByMealDateAscCreatedAtAsc(user.getId(), start, end);

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4, 36, 36, 36, 36);
            PdfWriter.getInstance(document, out);
            document.open();

            // Document Header
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Paragraph title = new Paragraph("BAO CAO DINH DUONG & NHAT KY BUA AN", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            Font subTitleFont = FontFactory.getFont(FontFactory.HELVETICA, 11);
            Paragraph subTitle = new Paragraph(String.format("Nguoi dung: %s (%s) | Tu ngay: %s den ngay: %s",
                    user.getFullName(), user.getEmail(),
                    start.format(DateTimeFormatter.ISO_DATE),
                    end.format(DateTimeFormatter.ISO_DATE)), subTitleFont);
            subTitle.setAlignment(Element.ALIGN_CENTER);
            subTitle.setSpacingAfter(20);
            document.add(subTitle);

            // Table
            PdfPTable table = new PdfPTable(6);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{2.5f, 2.0f, 3.5f, 2.0f, 2.0f, 2.0f});

            String[] headers = {"Ngay", "Bua an", "Ten mon", "Calories", "Protein(g)", "Carbs(g)"};
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10);
            for (String header : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(header, headerFont));
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                cell.setPadding(6);
                table.addCell(cell);
            }

            Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 9);
            double sumCalories = 0;
            for (Meal meal : meals) {
                sumCalories += (meal.getTotalCalories() != null ? meal.getTotalCalories() : 0);
                table.addCell(new Phrase(meal.getMealDate().toString(), bodyFont));
                table.addCell(new Phrase(meal.getMealType().name(), bodyFont));
                table.addCell(new Phrase(meal.getName() != null ? meal.getName() : "-", bodyFont));
                table.addCell(new Phrase(String.format("%.1f", meal.getTotalCalories()), bodyFont));
                table.addCell(new Phrase(String.format("%.1f", meal.getTotalProtein()), bodyFont));
                table.addCell(new Phrase(String.format("%.1f", meal.getTotalCarbs()), bodyFont));
            }

            document.add(table);

            Paragraph summary = new Paragraph(String.format("\nTong so bua an: %d | Tong nang luong: %.1f kcal",
                    meals.size(), sumCalories), FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11));
            summary.setSpacingBefore(10);
            document.add(summary);

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            log.error("Lỗi khi tạo file PDF: {}", e.getMessage());
            throw new RuntimeException("Không thể xuất báo cáo PDF", e);
        }
    }
}
