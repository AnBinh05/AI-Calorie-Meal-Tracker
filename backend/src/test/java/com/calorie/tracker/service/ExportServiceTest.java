package com.calorie.tracker.service;

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

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ExportServiceTest {

    @Mock
    private MealRepository mealRepository;

    @Mock
    private HealthProfileRepository healthProfileRepository;

    @Mock
    private UserService userService;

    @InjectMocks
    private ExportService exportService;

    private User mockUser;

    @BeforeEach
    void setUp() {
        mockUser = User.builder()
                .id(1L)
                .email("export@example.com")
                .fullName("Nguyễn Văn Export")
                .role(Role.ROLE_USER)
                .build();
    }

    @Test
    @DisplayName("Xuất CSV có UTF-8 BOM và đầy đủ dữ liệu món ăn")
    void testExportToCsvIncludesBomAndMealItems() {
        LocalDate today = LocalDate.of(2026, 10, 5);
        MealItem item = MealItem.builder()
                .name("Phở bò tái")
                .estimatedWeightGrams(400.0)
                .calories(420.0)
                .protein(26.0)
                .carbs(58.0)
                .fat(9.0)
                .build();

        Meal meal = Meal.builder()
                .id(1L)
                .user(mockUser)
                .mealDate(today)
                .mealType(MealType.BREAKFAST)
                .name("Bữa sáng Phở bò")
                .totalCalories(420.0)
                .totalProtein(26.0)
                .totalCarbs(58.0)
                .totalFat(9.0)
                .items(List.of(item))
                .build();

        when(userService.getCurrentAuthenticatedUser()).thenReturn(mockUser);
        when(mealRepository.findByUserIdAndMealDateBetweenOrderByMealDateAscCreatedAtAsc(eq(1L), any(), any()))
                .thenReturn(List.of(meal));

        byte[] csvBytes = exportService.exportToCsv(today, today);

        assertThat(csvBytes.length).isGreaterThan(3);
        assertThat(csvBytes[0]).isEqualTo((byte) 0xEF);
        assertThat(csvBytes[1]).isEqualTo((byte) 0xBB);
        assertThat(csvBytes[2]).isEqualTo((byte) 0xBF);

        String csvContent = new String(csvBytes, 3, csvBytes.length - 3, StandardCharsets.UTF_8);
        assertThat(csvContent).contains("Phở bò tái");
        assertThat(csvContent).contains("420.0");
    }

    @Test
    @DisplayName("Xuất PDF tạo tài liệu PDF hợp lệ kèm thông số HealthProfile")
    void testExportToPdfGeneratesValidPdfBytes() {
        LocalDate today = LocalDate.of(2026, 10, 5);
        HealthProfile profile = HealthProfile.builder()
                .user(mockUser)
                .bmr(1650)
                .tdee(2200)
                .dailyCalorieTarget(1900)
                .dailyProteinTargetGrams(140)
                .dailyCarbsTargetGrams(210)
                .dailyFatTargetGrams(55)
                .build();

        when(userService.getCurrentAuthenticatedUser()).thenReturn(mockUser);
        when(mealRepository.findByUserIdAndMealDateBetweenOrderByMealDateAscCreatedAtAsc(eq(1L), any(), any()))
                .thenReturn(List.of());
        when(healthProfileRepository.findByUser(mockUser)).thenReturn(Optional.of(profile));

        byte[] pdfBytes = exportService.exportToPdf(today, today);

        assertThat(pdfBytes.length).isGreaterThan(100);
        String header = new String(pdfBytes, 0, 4, StandardCharsets.US_ASCII);
        assertThat(header).isEqualTo("%PDF");
    }
}
