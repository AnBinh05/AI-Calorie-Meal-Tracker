package com.calorie.tracker.service;

import com.calorie.tracker.dto.request.CreateFavoriteMealRequest;
import com.calorie.tracker.dto.request.MealItemRequest;
import com.calorie.tracker.dto.response.FavoriteMealDto;
import com.calorie.tracker.dto.response.MealDto;
import com.calorie.tracker.entity.*;
import com.calorie.tracker.exception.BadRequestException;
import com.calorie.tracker.exception.ResourceNotFoundException;
import com.calorie.tracker.repository.FavoriteMealRepository;
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
class FavoriteMealServiceTest {

    @Mock
    private FavoriteMealRepository favoriteMealRepository;

    @Mock
    private MealRepository mealRepository;

    @Mock
    private UserService userService;

    @Mock
    private MealService mealService;

    @InjectMocks
    private FavoriteMealService favoriteMealService;

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
    @DisplayName("Ném BadRequestException khi tạo món yêu thích có tên đã tồn tại trong danh sách của người dùng")
    void testCreateFavoriteMealThrowsOnDuplicateName() {
        // Given
        CreateFavoriteMealRequest request = CreateFavoriteMealRequest.builder()
                .name("Phở Bò Tái")
                .mealType(MealType.BREAKFAST)
                .items(List.of())
                .build();

        when(userService.getCurrentAuthenticatedUser()).thenReturn(mockUser);
        when(favoriteMealRepository.existsByUserIdAndNameIgnoreCase(1L, "Phở Bò Tái")).thenReturn(true);

        // When & Then
        assertThatThrownBy(() -> favoriteMealService.createFavoriteMeal(request))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Món ăn yêu thích với tên này đã tồn tại");

        verify(favoriteMealRepository, never()).save(any());
    }

    @Test
    @DisplayName("Tạo món yêu thích thủ công thành công kèm tính toán tổng dinh dưỡng")
    void testCreateFavoriteMealSuccess() {
        // Given
        CreateFavoriteMealRequest request = CreateFavoriteMealRequest.builder()
                .name("Bánh mì ốp la")
                .mealType(MealType.BREAKFAST)
                .items(List.of(
                        MealItemRequest.builder()
                                .name("Bánh mì")
                                .calories(250.0)
                                .protein(8.0)
                                .carbs(45.0)
                                .fat(2.0)
                                .build(),
                        MealItemRequest.builder()
                                .name("Trứng ốp la")
                                .calories(140.0)
                                .protein(12.0)
                                .carbs(1.0)
                                .fat(10.0)
                                .build()
                ))
                .build();

        when(userService.getCurrentAuthenticatedUser()).thenReturn(mockUser);
        when(favoriteMealRepository.existsByUserIdAndNameIgnoreCase(1L, "Bánh mì ốp la")).thenReturn(false);
        when(favoriteMealRepository.save(any(FavoriteMeal.class))).thenAnswer(invocation -> {
            FavoriteMeal f = invocation.getArgument(0);
            f.setId(100L);
            return f;
        });

        // When
        FavoriteMealDto result = favoriteMealService.createFavoriteMeal(request);

        // Then
        assertThat(result.getId()).isEqualTo(100L);
        assertThat(result.getName()).isEqualTo("Bánh mì ốp la");
        assertThat(result.getTotalCalories()).isEqualTo(390.0);
        assertThat(result.getTotalProtein()).isEqualTo(20.0);
        assertThat(result.getTotalCarbs()).isEqualTo(46.0);
        assertThat(result.getTotalFat()).isEqualTo(12.0);
        assertThat(result.getItems()).hasSize(2);
    }

    @Test
    @DisplayName("Ghi nhận nhanh (Quick Log) món yêu thích vào nhật ký và tăng usageCount")
    void testQuickLogFavoriteMealIncrementsUsageCount() {
        // Given
        FavoriteMealItem fItem = FavoriteMealItem.builder()
                .id(1L)
                .name("Chuối tiêu")
                .calories(105.0)
                .protein(1.3)
                .carbs(27.0)
                .fat(0.3)
                .build();

        FavoriteMeal favoriteMeal = FavoriteMeal.builder()
                .id(50L)
                .user(mockUser)
                .name("Chuối ăn nhẹ")
                .mealType(MealType.SNACK)
                .usageCount(3)
                .items(new ArrayList<>(List.of(fItem)))
                .build();

        when(userService.getCurrentAuthenticatedUser()).thenReturn(mockUser);
        when(favoriteMealRepository.findByIdAndUserId(50L, 1L)).thenReturn(Optional.of(favoriteMeal));
        when(mealRepository.save(any(Meal.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(mealService.mapToDto(any(Meal.class))).thenReturn(MealDto.builder().id(200L).name("Chuối ăn nhẹ").build());

        // When
        MealDto result = favoriteMealService.quickLogFavoriteMeal(50L, null);

        // Then
        assertThat(result).isNotNull();
        assertThat(favoriteMeal.getUsageCount()).isEqualTo(4);

        verify(mealRepository, times(1)).save(any(Meal.class));
        verify(favoriteMealRepository, times(1)).save(favoriteMeal);
    }
}
