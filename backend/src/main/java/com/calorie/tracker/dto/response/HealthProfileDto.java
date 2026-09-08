package com.calorie.tracker.dto.response;

import com.calorie.tracker.entity.ActivityLevel;
import com.calorie.tracker.entity.Gender;
import com.calorie.tracker.entity.Goal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HealthProfileDto {

    private Long id;
    private Integer age;
    private Gender gender;
    private Double heightCm;
    private Double weightKg;
    private Double targetWeightKg;
    private Double bmi;
    private String bmiCategory;
    private ActivityLevel activityLevel;
    private Goal goal;
    private Integer bmr;
    private Integer tdee;
    private Integer dailyCalorieTarget;
    private Integer dailyProteinTargetGrams;
    private Integer dailyCarbsTargetGrams;
    private Integer dailyFatTargetGrams;
    private LocalDateTime updatedAt;
}
