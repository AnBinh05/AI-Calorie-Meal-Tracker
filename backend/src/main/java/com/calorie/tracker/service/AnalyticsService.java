package com.calorie.tracker.service;

import com.calorie.tracker.dto.response.DailySummaryDto;
import com.calorie.tracker.dto.response.DateRangeSummaryDto;
import com.calorie.tracker.dto.response.MealDto;
import com.calorie.tracker.entity.HealthProfile;
import com.calorie.tracker.entity.Meal;
import com.calorie.tracker.entity.User;
import com.calorie.tracker.repository.HealthProfileRepository;
import com.calorie.tracker.repository.MealRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final MealRepository mealRepository;
    private final HealthProfileRepository healthProfileRepository;
    private final UserService userService;
    private final MealService mealService;

    public DailySummaryDto getDailySummary(LocalDate date) {
        User user = userService.getCurrentAuthenticatedUser();
        LocalDate queryDate = (date != null) ? date : LocalDate.now();

        List<Meal> meals = mealRepository.findByUserIdAndMealDateOrderByCreatedAtDesc(user.getId(), queryDate);
        HealthProfile profile = healthProfileRepository.findByUser(user).orElse(null);

        int calorieTarget = profile != null && profile.getDailyCalorieTarget() != null ? profile.getDailyCalorieTarget() : 2000;
        int proteinTarget = profile != null && profile.getDailyProteinTargetGrams() != null ? profile.getDailyProteinTargetGrams() : 150;
        int carbsTarget = profile != null && profile.getDailyCarbsTargetGrams() != null ? profile.getDailyCarbsTargetGrams() : 225;
        int fatTarget = profile != null && profile.getDailyFatTargetGrams() != null ? profile.getDailyFatTargetGrams() : 55;

        double totalCalories = meals.stream().mapToDouble(m -> m.getTotalCalories() != null ? m.getTotalCalories() : 0.0).sum();
        double totalProtein = meals.stream().mapToDouble(m -> m.getTotalProtein() != null ? m.getTotalProtein() : 0.0).sum();
        double totalCarbs = meals.stream().mapToDouble(m -> m.getTotalCarbs() != null ? m.getTotalCarbs() : 0.0).sum();
        double totalFat = meals.stream().mapToDouble(m -> m.getTotalFat() != null ? m.getTotalFat() : 0.0).sum();

        List<MealDto> mealDtos = meals.stream().map(mealService::mapToDto).collect(Collectors.toList());

        return DailySummaryDto.builder()
                .date(queryDate)
                .totalCaloriesConsumed(Math.round(totalCalories * 10.0) / 10.0)
                .calorieTarget(calorieTarget)
                .remainingCalories(Math.round((calorieTarget - totalCalories) * 10.0) / 10.0)
                .totalProteinConsumed(Math.round(totalProtein * 10.0) / 10.0)
                .proteinTargetGrams(proteinTarget)
                .totalCarbsConsumed(Math.round(totalCarbs * 10.0) / 10.0)
                .carbsTargetGrams(carbsTarget)
                .totalFatConsumed(Math.round(totalFat * 10.0) / 10.0)
                .fatTargetGrams(fatTarget)
                .mealCount(meals.size())
                .meals(mealDtos)
                .build();
    }

    public DateRangeSummaryDto getDateRangeSummary(LocalDate startDate, LocalDate endDate) {
        User user = userService.getCurrentAuthenticatedUser();
        LocalDate start = (startDate != null) ? startDate : LocalDate.now().minusDays(6);
        LocalDate end = (endDate != null) ? endDate : LocalDate.now();

        List<DailySummaryDto> summaries = new ArrayList<>();
        LocalDate current = start;
        while (!current.isAfter(end)) {
            summaries.add(getDailySummary(current));
            current = current.plusDays(1);
        }

        double totalRangeCalories = summaries.stream().mapToDouble(DailySummaryDto::getTotalCaloriesConsumed).sum();
        double totalRangeProtein = summaries.stream().mapToDouble(DailySummaryDto::getTotalProteinConsumed).sum();
        double totalRangeCarbs = summaries.stream().mapToDouble(DailySummaryDto::getTotalCarbsConsumed).sum();
        double totalRangeFat = summaries.stream().mapToDouble(DailySummaryDto::getTotalFatConsumed).sum();

        int daysCount = summaries.isEmpty() ? 1 : summaries.size();
        double avgCalories = totalRangeCalories / daysCount;
        double avgProtein = totalRangeProtein / daysCount;
        double avgCarbs = totalRangeCarbs / daysCount;
        double avgFat = totalRangeFat / daysCount;

        // Macro distribution percentage based on caloric contribution (Protein: 4, Carbs: 4, Fat: 9)
        double totalCalFromMacros = (totalRangeProtein * 4) + (totalRangeCarbs * 4) + (totalRangeFat * 9);
        Map<String, Double> macroDistribution = new HashMap<>();
        if (totalCalFromMacros > 0) {
            macroDistribution.put("proteinPercent", Math.round(((totalRangeProtein * 4) / totalCalFromMacros) * 1000.0) / 10.0);
            macroDistribution.put("carbsPercent", Math.round(((totalRangeCarbs * 4) / totalCalFromMacros) * 1000.0) / 10.0);
            macroDistribution.put("fatPercent", Math.round(((totalRangeFat * 9) / totalCalFromMacros) * 1000.0) / 10.0);
        } else {
            macroDistribution.put("proteinPercent", 30.0);
            macroDistribution.put("carbsPercent", 45.0);
            macroDistribution.put("fatPercent", 25.0);
        }

        HealthProfile profile = healthProfileRepository.findByUser(user).orElse(null);
        int calorieTarget = profile != null && profile.getDailyCalorieTarget() != null ? profile.getDailyCalorieTarget() : 2000;

        return DateRangeSummaryDto.builder()
                .startDate(start)
                .endDate(end)
                .averageDailyCalories(Math.round(avgCalories * 10.0) / 10.0)
                .averageDailyProtein(Math.round(avgProtein * 10.0) / 10.0)
                .averageDailyCarbs(Math.round(avgCarbs * 10.0) / 10.0)
                .averageDailyFat(Math.round(avgFat * 10.0) / 10.0)
                .dailyCalorieTarget(calorieTarget)
                .dailySummaries(summaries)
                .macroDistributionPercent(macroDistribution)
                .build();
    }
}
