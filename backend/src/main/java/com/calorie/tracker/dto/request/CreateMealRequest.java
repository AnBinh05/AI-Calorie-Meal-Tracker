package com.calorie.tracker.dto.request;

import com.calorie.tracker.entity.MealType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
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
public class CreateMealRequest {

    @NotNull(message = "Ngày ăn không được để trống")
    private LocalDate mealDate;

    @NotNull(message = "Loại bữa ăn không được để trống")
    private MealType mealType;

    private String name;

    private String imageUrl;

    private String healthTip;

    private String notes;

    @NotEmpty(message = "Bữa ăn phải có ít nhất 1 món")
    @Valid
    private List<MealItemRequest> items;
}
