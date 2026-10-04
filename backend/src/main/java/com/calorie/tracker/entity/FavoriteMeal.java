package com.calorie.tracker.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "favorite_meals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FavoriteMeal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MealType mealType;

    private String imageUrl;

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

    @Column(nullable = false)
    @Builder.Default
    private Integer usageCount = 0;

    @OneToMany(mappedBy = "favoriteMeal", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<FavoriteMealItem> items = new ArrayList<>();

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public void addItem(FavoriteMealItem item) {
        items.add(item);
        item.setFavoriteMeal(this);
    }

    public void removeItem(FavoriteMealItem item) {
        items.remove(item);
        item.setFavoriteMeal(null);
    }

    public void recalculateTotals() {
        this.totalCalories = items.stream().mapToDouble(i -> i.getCalories() != null ? i.getCalories() : 0.0).sum();
        this.totalProtein = items.stream().mapToDouble(i -> i.getProtein() != null ? i.getProtein() : 0.0).sum();
        this.totalCarbs = items.stream().mapToDouble(i -> i.getCarbs() != null ? i.getCarbs() : 0.0).sum();
        this.totalFat = items.stream().mapToDouble(i -> i.getFat() != null ? i.getFat() : 0.0).sum();
    }

    public void incrementUsageCount() {
        if (this.usageCount == null) {
            this.usageCount = 1;
        } else {
            this.usageCount++;
        }
    }
}
