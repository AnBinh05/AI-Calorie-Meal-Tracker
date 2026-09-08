package com.calorie.tracker.repository;

import com.calorie.tracker.entity.Meal;
import com.calorie.tracker.entity.MealType;
import com.calorie.tracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface MealRepository extends JpaRepository<Meal, Long> {
    List<Meal> findByUserAndMealDateOrderByCreatedAtDesc(User user, LocalDate mealDate);
    List<Meal> findByUserIdAndMealDateOrderByCreatedAtDesc(Long userId, LocalDate mealDate);

    List<Meal> findByUserIdAndMealDateBetweenOrderByMealDateAscCreatedAtAsc(Long userId, LocalDate startDate, LocalDate endDate);

    Optional<Meal> findByIdAndUserId(Long id, Long userId);

    @Query("SELECT m FROM Meal m WHERE m.user.id = :userId AND m.mealDate = :mealDate AND m.mealType = :mealType")
    List<Meal> findByUserIdAndMealDateAndMealType(@Param("userId") Long userId, 
                                                @Param("mealDate") LocalDate mealDate, 
                                                @Param("mealType") MealType mealType);
}
