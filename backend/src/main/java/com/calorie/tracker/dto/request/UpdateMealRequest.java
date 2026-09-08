package com.calorie.tracker.dto.request;

import com.calorie.tracker.entity.MealType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
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
public class UpdateMealRequest {

    private LocalDate mealDate;

    private MealType mealType;

    private String name;

    private String imageUrl;

    private String healthTip;

    private String notes;

    @Valid
    private List<MealItemRequest> items;
}
