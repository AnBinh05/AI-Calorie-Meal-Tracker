package com.calorie.tracker.entity;

public enum MealType {
    BREAKFAST("Bữa sáng"),
    LUNCH("Bữa trưa"),
    DINNER("Bữa tối"),
    SNACK("Bữa ăn nhẹ");

    private final String displayName;

    MealType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
