package com.calorie.tracker.config;

import com.calorie.tracker.entity.*;
import com.calorie.tracker.repository.FavoriteMealRepository;
import com.calorie.tracker.repository.HealthProfileRepository;
import com.calorie.tracker.repository.MealRepository;
import com.calorie.tracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final HealthProfileRepository healthProfileRepository;
    private final MealRepository mealRepository;
    private final FavoriteMealRepository favoriteMealRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.findByEmail("demo@nutriai.vn").isPresent()) {
            log.info("Demo user demo@nutriai.vn đã tồn tại, bỏ qua bước khởi tạo mẫu.");
            return;
        }

        log.info("🚀 Đang khởi tạo dữ liệu mẫu NutriAI cho môi trường Demo...");

        // 1. Tạo User demo
        User demoUser = User.builder()
                .email("demo@nutriai.vn")
                .password(passwordEncoder.encode("123456"))
                .fullName("Nguyễn Văn Demo")
                .role(Role.ROLE_USER)
                .avatarUrl("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150")
                .build();
        demoUser = userRepository.save(demoUser);

        // 2. Tạo Health Profile
        HealthProfile profile = HealthProfile.builder()
                .user(demoUser)
                .age(25)
                .gender(Gender.MALE)
                .heightCm(172.0)
                .weightKg(68.0)
                .targetWeightKg(65.0)
                .activityLevel(ActivityLevel.MODERATELY_ACTIVE)
                .goal(Goal.LOSE_WEIGHT)
                .bmr(1650)
                .tdee(2200)
                .dailyCalorieTarget(1900)
                .dailyProteinTargetGrams(140)
                .dailyCarbsTargetGrams(210)
                .dailyFatTargetGrams(55)
                .build();
        healthProfileRepository.save(profile);

        // 3. Tạo bữa ăn hôm nay
        LocalDate today = LocalDate.now();

        // Bữa sáng: Phở bò tái nạm
        Meal breakfast = Meal.builder()
                .user(demoUser)
                .name("Phở bò tái nạm gia truyền")
                .mealType(MealType.BREAKFAST)
                .mealDate(today)
                .notes("Ăn sáng cùng đồng nghiệp, ít bánh nhiều thịt")
                .healthTip("Bữa sáng giàu protein và năng lượng, giúp duy trì sự tỉnh táo suốt buổi sáng!")
                .items(new ArrayList<>())
                .build();

        MealItem phoBoBanh = MealItem.builder()
                .meal(breakfast)
                .name("Bánh phở tươi")
                .estimatedWeightGrams(180.0)
                .servingSize("1 tô vừa")
                .calories(250.0)
                .protein(5.0)
                .carbs(55.0)
                .fat(1.0)
                .fiber(1.5)
                .confidenceScore(0.96)
                .build();

        MealItem phoBoThit = MealItem.builder()
                .meal(breakfast)
                .name("Thịt bò tái nạm")
                .estimatedWeightGrams(120.0)
                .servingSize("1 phần bò")
                .calories(280.0)
                .protein(28.0)
                .carbs(0.0)
                .fat(18.0)
                .fiber(0.0)
                .confidenceScore(0.94)
                .build();

        breakfast.addItem(phoBoBanh);
        breakfast.addItem(phoBoThit);
        breakfast.recalculateTotals();
        mealRepository.save(breakfast);

        // Bữa trưa: Cơm ức gà nướng sốt tiêu đen
        Meal lunch = Meal.builder()
                .user(demoUser)
                .name("Cơm ức gà nướng tiêu đen kèm salad")
                .mealType(MealType.LUNCH)
                .mealDate(today)
                .notes("Healthy lunch box chuẩn bị từ nhà")
                .healthTip("Tỷ lệ đạm/carb rất tốt, nhiều chất xơ từ súp lơ xanh hỗ trợ kiểm soát đường huyết.")
                .items(new ArrayList<>())
                .build();

        MealItem comTrang = MealItem.builder()
                .meal(lunch)
                .name("Cơm gạo lứt")
                .estimatedWeightGrams(150.0)
                .servingSize("1 bát")
                .calories(165.0)
                .protein(3.8)
                .carbs(35.0)
                .fat(1.2)
                .fiber(2.5)
                .confidenceScore(0.95)
                .build();

        MealItem ucGa = MealItem.builder()
                .meal(lunch)
                .name("Ức gà nướng tiêu đen")
                .estimatedWeightGrams(160.0)
                .servingSize("1 miếng lớn")
                .calories(260.0)
                .protein(48.0)
                .carbs(2.0)
                .fat(6.0)
                .fiber(0.0)
                .confidenceScore(0.97)
                .build();

        MealItem rauCu = MealItem.builder()
                .meal(lunch)
                .name("Bông cải xanh & cà rốt luộc")
                .estimatedWeightGrams(120.0)
                .servingSize("1 đĩa nhỏ")
                .calories(65.0)
                .protein(3.2)
                .carbs(11.0)
                .fat(0.8)
                .fiber(4.5)
                .confidenceScore(0.91)
                .build();

        lunch.addItem(comTrang);
        lunch.addItem(ucGa);
        lunch.addItem(rauCu);
        lunch.recalculateTotals();
        mealRepository.save(lunch);

        // Bữa phụ: Sữa chua Hy Lạp & hạt chia
        Meal snack = Meal.builder()
                .user(demoUser)
                .name("Sữa chua Hy Lạp & hạt chia")
                .mealType(MealType.SNACK)
                .mealDate(today)
                .notes("Bữa xế chiều lúc 15:30")
                .healthTip("Chứa nhiều lợi khuẩn probiotics cho đường ruột và omega-3 từ hạt chia.")
                .items(new ArrayList<>())
                .build();

        MealItem suaChua = MealItem.builder()
                .meal(snack)
                .name("Sữa chua Hy Lạp không đường")
                .estimatedWeightGrams(120.0)
                .servingSize("1 hũ")
                .calories(110.0)
                .protein(12.0)
                .carbs(6.0)
                .fat(4.0)
                .fiber(0.0)
                .confidenceScore(0.98)
                .build();

        snack.addItem(suaChua);
        snack.recalculateTotals();
        mealRepository.save(snack);

        // 4. Tạo Favorite Meals mẫu
        FavoriteMeal fav1 = FavoriteMeal.builder()
                .user(demoUser)
                .name("Phở bò tái nạm gia truyền")
                .mealType(MealType.BREAKFAST)
                .notes("Món ăn sáng ruột mỗi sáng thứ 2 và thứ 6")
                .totalCalories(530.0)
                .totalProtein(33.0)
                .totalCarbs(55.0)
                .totalFat(19.0)
                .usageCount(12)
                .items(new ArrayList<>())
                .build();

        FavoriteMealItem favItem1 = FavoriteMealItem.builder()
                .favoriteMeal(fav1)
                .name("Bánh phở tươi")
                .estimatedWeightGrams(180.0)
                .servingSize("1 tô vừa")
                .calories(250.0)
                .protein(5.0)
                .carbs(55.0)
                .fat(1.0)
                .fiber(1.5)
                .build();

        FavoriteMealItem favItem2 = FavoriteMealItem.builder()
                .favoriteMeal(fav1)
                .name("Thịt bò tái nạm")
                .estimatedWeightGrams(120.0)
                .servingSize("1 phần")
                .calories(280.0)
                .protein(28.0)
                .carbs(0.0)
                .fat(18.0)
                .fiber(0.0)
                .build();

        fav1.addItem(favItem1);
        fav1.addItem(favItem2);
        favoriteMealRepository.save(fav1);

        FavoriteMeal fav2 = FavoriteMeal.builder()
                .user(demoUser)
                .name("Salad ức gà sốt mè rang")
                .mealType(MealType.LUNCH)
                .notes("Món ăn trưa văn phòng nhanh gọn chuẩn keto/clean")
                .totalCalories(420.0)
                .totalProtein(42.0)
                .totalCarbs(15.0)
                .totalFat(18.0)
                .usageCount(8)
                .items(new ArrayList<>())
                .build();
        favoriteMealRepository.save(fav2);

        log.info("✅ Đã khởi tạo xong dữ liệu mẫu NutriAI! Tài khoản Demo: demo@nutriai.vn / Mật khẩu: 123456");
    }
}
