package com.calorie.tracker.dto.response;

import com.calorie.tracker.entity.MealType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MealDto {

    private Long id;
    private LocalDate mealDate;
    private MealType mealType;
    private String mealTypeDisplayName;
    private String name;
    private String imageUrl;
    private String healthTip;
    private String notes;
    private Double totalCalories;
    private Double totalProtein;
    private Double totalCarbs;
    private Double totalFat;
    private List<MealItemDto> items;
    private LocalDateTime createdAt;
}
