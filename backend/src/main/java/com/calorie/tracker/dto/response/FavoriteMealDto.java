package com.calorie.tracker.dto.response;

import com.calorie.tracker.entity.MealType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Thông tin chi tiết món ăn yêu thích")
public class FavoriteMealDto {

    @Schema(description = "ID định danh món yêu thích", example = "1")
    private Long id;

    @Schema(description = "Tên món yêu thích", example = "Combo Ức gà nướng & Khoai lang hấp")
    private String name;

    @Schema(description = "Loại bữa ăn", example = "LUNCH")
    private MealType mealType;

    @Schema(description = "Tên hiển thị tiếng Việt của bữa ăn", example = "Bữa trưa")
    private String mealTypeDisplayName;

    @Schema(description = "URL ảnh minh họa")
    private String imageUrl;

    @Schema(description = "Ghi chú cá nhân")
    private String notes;

    @Schema(description = "Tổng calories (kcal)", example = "442.5")
    private Double totalCalories;

    @Schema(description = "Tổng Protein (g)", example = "48.3")
    private Double totalProtein;

    @Schema(description = "Tổng Carbohydrates (g)", example = "50.0")
    private Double totalCarbs;

    @Schema(description = "Tổng Chất béo (g)", example = "5.8")
    private Double totalFat;

    @Schema(description = "Số lần người dùng đã chọn log món này", example = "12")
    private Integer usageCount;

    @Schema(description = "Số lượng món thành phần", example = "2")
    private Integer itemsCount;

    @Schema(description = "Danh sách các món con chi tiết")
    private List<MealItemDto> items;

    @Schema(description = "Thời gian tạo")
    private LocalDateTime createdAt;

    @Schema(description = "Thời gian cập nhật gần nhất")
    private LocalDateTime updatedAt;
}
