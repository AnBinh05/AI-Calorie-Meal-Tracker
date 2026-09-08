package com.calorie.tracker.service;

import com.calorie.tracker.dto.request.HealthProfileRequest;
import com.calorie.tracker.dto.response.HealthProfileDto;
import com.calorie.tracker.entity.ActivityLevel;
import com.calorie.tracker.entity.Gender;
import com.calorie.tracker.entity.Goal;
import com.calorie.tracker.entity.HealthProfile;
import com.calorie.tracker.entity.User;
import com.calorie.tracker.exception.ResourceNotFoundException;
import com.calorie.tracker.repository.HealthProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class HealthProfileService {

    private final HealthProfileRepository healthProfileRepository;
    private final UserService userService;

    public HealthProfileDto getMyProfile() {
        User user = userService.getCurrentAuthenticatedUser();
        HealthProfile profile = healthProfileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng chưa thiết lập hồ sơ sức khỏe"));
        return mapToDto(profile);
    }

    @Transactional
    public HealthProfileDto upsertMyProfile(HealthProfileRequest request) {
        User user = userService.getCurrentAuthenticatedUser();
        HealthProfile profile = healthProfileRepository.findByUser(user)
                .orElse(HealthProfile.builder().user(user).build());

        profile.setAge(request.getAge());
        profile.setGender(request.getGender());
        profile.setHeightCm(request.getHeightCm());
        profile.setWeightKg(request.getWeightKg());
        profile.setTargetWeightKg(request.getTargetWeightKg());
        profile.setActivityLevel(request.getActivityLevel());
        profile.setGoal(request.getGoal());

        // Calculate BMR & TDEE
        int bmr = calculateBmr(request.getWeightKg(), request.getHeightCm(), request.getAge(), request.getGender());
        int tdee = calculateTdee(bmr, request.getActivityLevel());
        
        int calorieTarget = request.getCustomDailyCalorieTarget() != null && request.getCustomDailyCalorieTarget() > 500
                ? request.getCustomDailyCalorieTarget()
                : calculateDailyCalorieTarget(tdee, request.getGoal());

        profile.setBmr(bmr);
        profile.setTdee(tdee);
        profile.setDailyCalorieTarget(calorieTarget);

        // Standard Macronutrient Distribution: 30% Protein, 45% Carbs, 25% Fat
        int proteinGrams = (int) Math.round((calorieTarget * 0.30) / 4.0);
        int carbsGrams = (int) Math.round((calorieTarget * 0.45) / 4.0);
        int fatGrams = (int) Math.round((calorieTarget * 0.25) / 9.0);

        profile.setDailyProteinTargetGrams(proteinGrams);
        profile.setDailyCarbsTargetGrams(carbsGrams);
        profile.setDailyFatTargetGrams(fatGrams);

        HealthProfile saved = healthProfileRepository.save(profile);
        return mapToDto(saved);
    }

    public int calculateBmr(double weightKg, double heightCm, int age, Gender gender) {
        // Mifflin-St Jeor Equation
        double baseBmr = (10.0 * weightKg) + (6.25 * heightCm) - (5.0 * age);
        if (gender == Gender.MALE) {
            return (int) Math.round(baseBmr + 5);
        } else if (gender == Gender.FEMALE) {
            return (int) Math.round(baseBmr - 161);
        } else {
            return (int) Math.round(baseBmr - 78);
        }
    }

    public int calculateTdee(int bmr, ActivityLevel activityLevel) {
        return (int) Math.round(bmr * activityLevel.getMultiplier());
    }

    public int calculateDailyCalorieTarget(int tdee, Goal goal) {
        int target = tdee + goal.getCalorieAdjustment();
        return Math.max(target, 1200); // Minimum healthy calorie threshold
    }

    public HealthProfileDto mapToDto(HealthProfile profile) {
        double heightInM = profile.getHeightCm() / 100.0;
        double bmi = Math.round((profile.getWeightKg() / (heightInM * heightInM)) * 10.0) / 10.0;

        String bmiCategory;
        if (bmi < 18.5) {
            bmiCategory = "Thiếu cân (Underweight)";
        } else if (bmi < 24.9) {
            bmiCategory = "Bình thường (Normal weight)";
        } else if (bmi < 29.9) {
            bmiCategory = "Thừa cân (Overweight)";
        } else {
            bmiCategory = "Béo phì (Obese)";
        }

        return HealthProfileDto.builder()
                .id(profile.getId())
                .age(profile.getAge())
                .gender(profile.getGender())
                .heightCm(profile.getHeightCm())
                .weightKg(profile.getWeightKg())
                .targetWeightKg(profile.getTargetWeightKg())
                .bmi(bmi)
                .bmiCategory(bmiCategory)
                .activityLevel(profile.getActivityLevel())
                .goal(profile.getGoal())
                .bmr(profile.getBmr())
                .tdee(profile.getTdee())
                .dailyCalorieTarget(profile.getDailyCalorieTarget())
                .dailyProteinTargetGrams(profile.getDailyProteinTargetGrams())
                .dailyCarbsTargetGrams(profile.getDailyCarbsTargetGrams())
                .dailyFatTargetGrams(profile.getDailyFatTargetGrams())
                .updatedAt(profile.getUpdatedAt())
                .build();
    }
}
