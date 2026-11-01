package com.calorie.tracker.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "favorite_meal_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FavoriteMealItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "favorite_meal_id", nullable = false)
    private FavoriteMeal favoriteMeal;

    @Column(nullable = false)
    private String name;

    private Double estimatedWeightGrams;

    private String servingSize;

    @Column(nullable = false)
    private Double calories;

    private Double protein;

    private Double carbs;

    private Double fat;

    private Double fiber;

    private Double confidenceScore;
}
