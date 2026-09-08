package com.calorie.tracker.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailySummaryDto {

    private LocalDate date;
    private Double totalCaloriesConsumed;
    private Integer calorieTarget;
    private Double remainingCalories;
    private Double totalProteinConsumed;
    private Integer proteinTargetGrams;
    private Double totalCarbsConsumed;
    private Integer carbsTargetGrams;
    private Double totalFatConsumed;
    private Integer fatTargetGrams;
    private int mealCount;
    private List<MealDto> meals;
}
