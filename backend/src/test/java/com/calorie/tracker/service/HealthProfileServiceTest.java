package com.calorie.tracker.service;

import com.calorie.tracker.dto.request.HealthProfileRequest;
import com.calorie.tracker.dto.response.HealthProfileDto;
import com.calorie.tracker.entity.*;
import com.calorie.tracker.repository.HealthProfileRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class HealthProfileServiceTest {

    @Mock
    private HealthProfileRepository healthProfileRepository;

    @Mock
    private UserService userService;

    @InjectMocks
    private HealthProfileService healthProfileService;

    private User mockUser;

    @BeforeEach
    void setUp() {
        mockUser = User.builder()
                .id(1L)
                .email("test@example.com")
                .fullName("Nguyen Van Test")
                .role(Role.ROLE_USER)
                .build();
    }

    @Test
    @DisplayName("Tính toán BMR, TDEE và mục tiêu giảm mỡ cho Nam giới chuẩn xác")
    void testCalculateMetricsForMaleLoseWeight() {
        // Given
        HealthProfileRequest request = HealthProfileRequest.builder()
                .age(25)
                .gender(Gender.MALE)
                .heightCm(175.0)
                .weightKg(75.0)
                .activityLevel(ActivityLevel.MODERATE) // x1.55
                .goal(Goal.LOSE_WEIGHT)               // TDEE - 500 kcal
                .build();

        when(userService.getCurrentAuthenticatedUser()).thenReturn(mockUser);
        when(healthProfileRepository.findByUserId(1L)).thenReturn(Optional.empty());
        when(healthProfileRepository.save(any(HealthProfile.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        HealthProfileDto result = healthProfileService.upsertMyProfile(request);

        // Then
        // BMI = 75 / (1.75 * 1.75) = 24.5
        assertThat(result.getBmi()).isEqualTo(24.5);
        assertThat(result.getBmiCategory()).isEqualTo("Bình thường");

        // BMR (Male) = (10 * 75) + (6.25 * 175) - (5 * 25) + 5 = 750 + 1093.75 - 125 + 5 = 1723.75 -> round to 1724
        assertThat(result.getBmr()).isEqualTo(1724);

        // TDEE = 1723.75 * 1.55 = 2671.81 -> round to 2672
        assertThat(result.getTdee()).isEqualTo(2672);

        // Daily Calorie Target (Lose weight) = 2672 - 500 = 2172 kcal
        assertThat(result.getDailyCalorieTarget()).isEqualTo(2172);

        // Macro targets should be positive and balanced
        assertThat(result.getDailyProteinTargetGrams()).isPositive();
        assertThat(result.getDailyCarbsTargetGrams()).isPositive();
        assertThat(result.getDailyFatTargetGrams()).isPositive();

        verify(healthProfileRepository, times(1)).save(any(HealthProfile.class));
    }

    @Test
    @DisplayName("Tính toán BMR cho Nữ giới chuẩn xác theo công thức Mifflin-St Jeor")
    void testCalculateMetricsForFemale() {
        // Given
        HealthProfileRequest request = HealthProfileRequest.builder()
                .age(30)
                .gender(Gender.FEMALE)
                .heightCm(160.0)
                .weightKg(55.0)
                .activityLevel(ActivityLevel.LIGHT)   // x1.375
                .goal(Goal.MAINTAIN_WEIGHT)
                .build();

        when(userService.getCurrentAuthenticatedUser()).thenReturn(mockUser);
        when(healthProfileRepository.findByUserId(1L)).thenReturn(Optional.empty());
        when(healthProfileRepository.save(any(HealthProfile.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        HealthProfileDto result = healthProfileService.upsertMyProfile(request);

        // Then
        // BMR (Female) = (10 * 55) + (6.25 * 160) - (5 * 30) - 161 = 550 + 1000 - 150 - 161 = 1239
        assertThat(result.getBmr()).isEqualTo(1239);
        // TDEE = 1239 * 1.375 = 1703.625 -> 1704
        assertThat(result.getTdee()).isEqualTo(1704);
        assertThat(result.getDailyCalorieTarget()).isEqualTo(1704);
    }
}
