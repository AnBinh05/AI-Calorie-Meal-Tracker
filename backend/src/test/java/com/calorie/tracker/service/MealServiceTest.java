package com.calorie.tracker.service;

import com.calorie.tracker.dto.request.CreateMealRequest;
import com.calorie.tracker.dto.request.MealItemRequest;
import com.calorie.tracker.dto.response.MealDto;
import com.calorie.tracker.entity.*;
import com.calorie.tracker.exception.ResourceNotFoundException;
import com.calorie.tracker.repository.MealItemRepository;
import com.calorie.tracker.repository.MealRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MealServiceTest {

    @Mock
    private MealRepository mealRepository;

    @Mock
    private MealItemRepository mealItemRepository;

    @Mock
    private UserService userService;

    @InjectMocks
    private MealService mealService;

    private User mockUser;

    @BeforeEach
    void setUp() {
        mockUser = User.builder()
                .id(1L)
                .email("user@example.com")
                .fullName("User Test")
                .role(Role.ROLE_USER)
                .build();
    }

    @Test
    @DisplayName("Tạo bữa ăn mới và tự động tính tổng Calories, Protein, Carbs, Fat chính xác")
    void testCreateMealCalculatesTotals() {
        // Given
        CreateMealRequest request = CreateMealRequest.builder()
                .mealDate(LocalDate.now())
                .mealType(MealType.LUNCH)
                .name("Cơm trưa văn phòng")
                .items(List.of(
                        MealItemRequest.builder()
                                .name("Cơm trắng")
                                .estimatedWeightGrams(150.0)
                                .calories(200.0)
                                .protein(4.0)
                                .carbs(45.0)
                                .fat(0.5)
                                .build(),
                        MealItemRequest.builder()
                                .name("Ức gà xào nấm")
                                .estimatedWeightGrams(120.0)
                                .calories(180.0)
                                .protein(30.0)
                                .carbs(5.0)
                                .fat(4.5)
                                .build()
                ))
                .build();

        when(userService.getCurrentAuthenticatedUser()).thenReturn(mockUser);
        when(mealRepository.save(any(Meal.class))).thenAnswer(invocation -> {
            Meal m = invocation.getArgument(0);
            m.setId(10L);
            return m;
        });

        // When
        MealDto result = mealService.createMeal(request);

        // Then
        assertThat(result.getId()).isEqualTo(10L);
        assertThat(result.getName()).isEqualTo("Cơm trưa văn phòng");
        assertThat(result.getTotalCalories()).isEqualTo(380.0);
        assertThat(result.getTotalProtein()).isEqualTo(34.0);
        assertThat(result.getTotalCarbs()).isEqualTo(50.0);
        assertThat(result.getTotalFat()).isEqualTo(5.0);
        assertThat(result.getItems()).hasSize(2);

        verify(mealRepository, times(1)).save(any(Meal.class));
    }

    @Test
    @DisplayName("Bảo vệ IDOR: Ném ResourceNotFoundException khi người dùng cố truy cập bữa ăn không thuộc sở hữu")
    void testGetMealByIdProtectsAgainstIdor() {
        // Given
        when(userService.getCurrentAuthenticatedUser()).thenReturn(mockUser);
        when(mealRepository.findByIdAndUserId(99L, 1L)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> mealService.getMealById(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Không tìm thấy bữa ăn với ID: 99");

        verify(mealRepository, times(1)).findByIdAndUserId(99L, 1L);
    }

    @Test
    @DisplayName("Xóa bữa ăn thành công khi đúng chủ sở hữu")
    void testDeleteMealSuccess() {
        // Given
        Meal meal = Meal.builder()
                .id(5L)
                .user(mockUser)
                .mealDate(LocalDate.now())
                .mealType(MealType.DINNER)
                .items(new ArrayList<>())
                .build();

        when(userService.getCurrentAuthenticatedUser()).thenReturn(mockUser);
        when(mealRepository.findByIdAndUserId(5L, 1L)).thenReturn(Optional.of(meal));

        // When
        mealService.deleteMeal(5L);

        // Then
        verify(mealRepository, times(1)).delete(meal);
    }
}
