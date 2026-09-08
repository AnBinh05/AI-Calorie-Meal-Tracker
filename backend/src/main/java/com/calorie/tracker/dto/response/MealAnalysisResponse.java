package com.calorie.tracker.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MealAnalysisResponse {

    private String suggestedMealName;
    private String imageUrl;
    private Double estimatedTotalCalories;
    private Double estimatedTotalProtein;
    private Double estimatedTotalCarbs;
    private Double estimatedTotalFat;
    private String healthTip;
    private List<MealItemDto> recognizedItems;
    private String rawAiResponse;
}
