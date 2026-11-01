package com.calorie.tracker.repository;

import com.calorie.tracker.entity.FavoriteMealItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FavoriteMealItemRepository extends JpaRepository<FavoriteMealItem, Long> {
    List<FavoriteMealItem> findByFavoriteMealId(Long favoriteMealId);
}
