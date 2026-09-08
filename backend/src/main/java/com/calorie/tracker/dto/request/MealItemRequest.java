package com.calorie.tracker.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MealItemRequest {

    private Long id;

    @NotBlank(message = "Tên món ăn không được để trống")
    private String name;

    private Double estimatedWeightGrams;

    private String servingSize;

    @NotNull(message = "Lượng calories không được để trống")
    private Double calories;

    private Double protein;

    private Double carbs;

    private Double fat;

    private Double fiber;

    private Double confidenceScore;
}
