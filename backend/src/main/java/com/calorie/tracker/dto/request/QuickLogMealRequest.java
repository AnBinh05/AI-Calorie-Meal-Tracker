package com.calorie.tracker.dto.request;

import com.calorie.tracker.entity.MealType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Tùy chọn khi ghi nhận nhanh món yêu thích vào nhật ký")
public class QuickLogMealRequest {

    @Schema(description = "Ngày muốn ghi nhận (mặc định hôm nay nếu null)", example = "2026-10-04")
    private LocalDate mealDate;

    @Schema(description = "Loại bữa ăn muốn ghi nhận (mặc định lấy theo món yêu thích nếu null)", example = "LUNCH")
    private MealType mealType;

    @Schema(description = "Ghi chú thêm cho bữa ăn này", example = "Ăn trưa nhanh tại văn phòng")
    private String notes;
}
