package com.calorie.tracker.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "meal_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MealItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "meal_id", nullable = false)
    private Meal meal;

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
