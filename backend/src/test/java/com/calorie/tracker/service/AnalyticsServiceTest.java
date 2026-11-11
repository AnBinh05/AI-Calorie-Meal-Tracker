package com.calorie.tracker.service;

import com.calorie.tracker.dto.response.DateRangeSummaryDto;
import com.calorie.tracker.dto.response.MealDto;
import com.calorie.tracker.entity.*;
import com.calorie.tracker.repository.HealthProfileRepository;
import com.calorie.tracker.repository.MealRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AnalyticsServiceTest {

    @Mock
    private MealRepository mealRepository;

    @Mock
    private HealthProfileRepository healthProfileRepository;

    @Mock
    private UserService userService;

    @Mock
    private MealService mealService;

    @InjectMocks
    private AnalyticsService analyticsService;

    private User mockUser;

    @BeforeEach
    void setUp() {
        mockUser = User.builder()
                .id(1L)
                .email("analytics@example.com")
                .fullName("Analytics User")
                .role(Role.ROLE_USER)
                .build();
    }

    @Test
    @DisplayName("Truy vấn khoảng ngày dùng đúng 1 batch query và tính chính xác trung bình Calo/Macro")
    void testGetDateRangeSummaryUsesSingleBatchQuery() {
        LocalDate day1 = LocalDate.of(2026, 10, 1);
        LocalDate day2 = LocalDate.of(2026, 10, 2);

        Meal meal1 = Meal.builder()
                .id(1L)
                .user(mockUser)
                .mealDate(day1)
                .mealType(MealType.LUNCH)
                .name("Cơm gà")
                .totalCalories(600.0)
                .totalProtein(40.0)
                .totalCarbs(70.0)
                .totalFat(15.0)
                .items(List.of())
                .build();

        HealthProfile profile = HealthProfile.builder()
                .user(mockUser)
                .dailyCalorieTarget(2200)
                .dailyProteinTargetGrams(165)
                .dailyCarbsTargetGrams(248)
                .dailyFatTargetGrams(61)
                .build();

        when(userService.getCurrentAuthenticatedUser()).thenReturn(mockUser);
        when(mealRepository.findByUserIdAndMealDateBetweenOrderByMealDateAscCreatedAtAsc(1L, day1, day2))
                .thenReturn(List.of(meal1));
        when(healthProfileRepository.findByUser(mockUser)).thenReturn(Optional.of(profile));
        when(mealService.mapToDto(any(Meal.class))).thenReturn(MealDto.builder().id(1L).name("Cơm gà").build());

        DateRangeSummaryDto result = analyticsService.getDateRangeSummary(day1, day2);

        assertThat(result.getDailySummaries()).hasSize(2);
        assertThat(result.getDailyCalorieTarget()).isEqualTo(2200);
        assertThat(result.getAverageDailyCalories()).isEqualTo(300.0);
        assertThat(result.getAverageDailyProtein()).isEqualTo(20.0);
        assertThat(result.getDailySummaries().get(0).getTotalCaloriesConsumed()).isEqualTo(600.0);
        assertThat(result.getDailySummaries().get(1).getTotalCaloriesConsumed()).isEqualTo(0.0);

        verify(mealRepository, times(1))
                .findByUserIdAndMealDateBetweenOrderByMealDateAscCreatedAtAsc(1L, day1, day2);
        verify(healthProfileRepository, times(1)).findByUser(mockUser);
    }
}
