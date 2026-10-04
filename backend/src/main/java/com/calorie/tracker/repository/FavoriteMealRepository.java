package com.calorie.tracker.repository;

import com.calorie.tracker.entity.FavoriteMeal;
import com.calorie.tracker.entity.MealType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FavoriteMealRepository extends JpaRepository<FavoriteMeal, Long> {

    Optional<FavoriteMeal> findByIdAndUserId(Long id, Long userId);

    boolean existsByUserIdAndNameIgnoreCase(Long userId, String name);

    Page<FavoriteMeal> findByUserId(Long userId, Pageable pageable);

    @Query("SELECT f FROM FavoriteMeal f WHERE f.user.id = :userId " +
           "AND (:mealType IS NULL OR f.mealType = :mealType) " +
           "AND (:keyword IS NULL OR LOWER(f.name) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<FavoriteMeal> searchFavorites(@Param("userId") Long userId,
                                       @Param("mealType") MealType mealType,
                                       @Param("keyword") String keyword,
                                       Pageable pageable);
}
