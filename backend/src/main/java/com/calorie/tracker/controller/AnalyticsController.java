package com.calorie.tracker.controller;

import com.calorie.tracker.dto.response.ApiResponse;
import com.calorie.tracker.dto.response.DailySummaryDto;
import com.calorie.tracker.dto.response.DateRangeSummaryDto;
import com.calorie.tracker.service.AnalyticsService;
import com.calorie.tracker.service.ExportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
@Tag(name = "4. Analytics & Reports", description = "Thống kê tiến độ dinh dưỡng và xuất báo cáo CSV / PDF")
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    private final ExportService exportService;

    @GetMapping("/daily-summary")
    @Operation(summary = "Lấy thống kê calories và macros trong ngày")
    public ResponseEntity<ApiResponse<DailySummaryDto>> getDailySummary(
            @RequestParam(value = "date", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        DailySummaryDto summary = analyticsService.getDailySummary(date);
        return ResponseEntity.ok(ApiResponse.ok(summary));
    }

    @GetMapping("/range")
    @Operation(summary = "Lấy thống kê dinh dưỡng theo khoảng ngày (7 ngày / 30 ngày)")
    public ResponseEntity<ApiResponse<DateRangeSummaryDto>> getRangeSummary(
            @RequestParam(value = "startDate", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(value = "endDate", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        DateRangeSummaryDto summary = analyticsService.getDateRangeSummary(startDate, endDate);
        return ResponseEntity.ok(ApiResponse.ok(summary));
    }

    @GetMapping("/export/csv")
    @Operation(summary = "Xuất dữ liệu nhật ký dinh dưỡng dạng file CSV")
    public ResponseEntity<byte[]> exportCsv(
            @RequestParam(value = "startDate", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(value = "endDate", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        byte[] csvData = exportService.exportToCsv(startDate, endDate);
        String filename = String.format("meal_report_%s.csv", LocalDate.now());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
                .body(csvData);
    }

    @GetMapping("/export/pdf")
    @Operation(summary = "Xuất báo cáo dinh dưỡng dạng file PDF")
    public ResponseEntity<byte[]> exportPdf(
            @RequestParam(value = "startDate", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(value = "endDate", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        byte[] pdfData = exportService.exportToPdf(startDate, endDate);
        String filename = String.format("meal_report_%s.pdf", LocalDate.now());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfData);
    }
}
