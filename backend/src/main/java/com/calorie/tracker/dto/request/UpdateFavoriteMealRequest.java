package com.calorie.tracker.dto.request;

import com.calorie.tracker.entity.MealType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Yêu cầu cập nhật món ăn yêu thích")
public class UpdateFavoriteMealRequest {

    @NotBlank(message = "Tên món ăn yêu thích không được để trống")
    @Size(max = 120, message = "Tên món không được vượt quá 120 ký tự")
    @Schema(description = "Tên món ăn cần cập nhật", example = "Combo Ức gà nướng sốt tiêu đen")
    private String name;

    @NotNull(message = "Loại bữa ăn không được để trống")
    @Schema(description = "Phân loại bữa ăn mặc định", example = "LUNCH")
    private MealType mealType;

    @Schema(description = "Đường dẫn ảnh đại diện món ăn", example = "/uploads/chicken-sweet-potato.jpg")
    private String imageUrl;

    @Size(max = 255, message = "Ghi chú không được vượt quá 255 ký tự")
    @Schema(description = "Ghi chú dinh dưỡng cá nhân", example = "Dành cho ngày tập chân nặng")
    private String notes;

    @NotEmpty(message = "Món ăn yêu thích phải có ít nhất 1 thành phần món ăn")
    @Valid
    @Schema(description = "Danh sách các món con hoặc thành phần dinh dưỡng")
    private List<MealItemRequest> items;
}
