package com.calorie.tracker.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "meals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Meal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDate mealDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MealType mealType;

    private String name;

    private String imageUrl;

    @Column(columnDefinition = "TEXT")
    private String healthTip;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(nullable = false)
    @Builder.Default
    private Double totalCalories = 0.0;

    @Column(nullable = false)
    @Builder.Default
    private Double totalProtein = 0.0;

    @Column(nullable = false)
    @Builder.Default
    private Double totalCarbs = 0.0;

    @Column(nullable = false)
    @Builder.Default
    private Double totalFat = 0.0;

    @OneToMany(mappedBy = "meal", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<MealItem> items = new ArrayList<>();

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public void addItem(MealItem item) {
        items.add(item);
        item.setMeal(this);
    }

    public void removeItem(MealItem item) {
        items.remove(item);
        item.setMeal(null);
    }

    public void recalculateTotals() {
        this.totalCalories = items.stream().mapToDouble(i -> i.getCalories() != null ? i.getCalories() : 0.0).sum();
        this.totalProtein = items.stream().mapToDouble(i -> i.getProtein() != null ? i.getProtein() : 0.0).sum();
        this.totalCarbs = items.stream().mapToDouble(i -> i.getCarbs() != null ? i.getCarbs() : 0.0).sum();
        this.totalFat = items.stream().mapToDouble(i -> i.getFat() != null ? i.getFat() : 0.0).sum();
    }
}
