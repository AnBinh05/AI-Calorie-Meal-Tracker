package com.calorie.tracker.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DateRangeSummaryDto {

    private LocalDate startDate;
    private LocalDate endDate;
    private Double averageDailyCalories;
    private Double averageDailyProtein;
    private Double averageDailyCarbs;
    private Double averageDailyFat;
    private Integer dailyCalorieTarget;
    private List<DailySummaryDto> dailySummaries;
    private Map<String, Double> macroDistributionPercent;
}
