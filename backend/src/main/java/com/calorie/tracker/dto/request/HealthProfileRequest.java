package com.calorie.tracker.dto.request;

import com.calorie.tracker.entity.ActivityLevel;
import com.calorie.tracker.entity.Gender;
import com.calorie.tracker.entity.Goal;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HealthProfileRequest {

    @NotNull(message = "Tuổi không được để trống")
    @Min(value = 10, message = "Tuổi phải từ 10 trở lên")
    @Max(value = 120, message = "Tuổi không hợp lệ")
    private Integer age;

    @NotNull(message = "Giới tính không được để trống")
    private Gender gender;

    @NotNull(message = "Chiều cao không được để trống")
    @Min(value = 50, message = "Chiều cao phải từ 50cm trở lên")
    @Max(value = 250, message = "Chiều cao không hợp lệ")
    private Double heightCm;

    @NotNull(message = "Cân nặng không được để trống")
    @Min(value = 20, message = "Cân nặng phải từ 20kg trở lên")
    @Max(value = 300, message = "Cân nặng không hợp lệ")
    private Double weightKg;

    private Double targetWeightKg;

    @NotNull(message = "Mức độ vận động không được để trống")
    private ActivityLevel activityLevel;

    @NotNull(message = "Mục tiêu không được để trống")
    private Goal goal;

    private Integer customDailyCalorieTarget;
}
