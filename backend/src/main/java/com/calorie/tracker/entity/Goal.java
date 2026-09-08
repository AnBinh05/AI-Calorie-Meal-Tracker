package com.calorie.tracker.entity;

public enum Goal {
    LOSE_WEIGHT(-500, "Giảm cân (thâm hụt 500 kcal/ngày)"),
    MAINTAIN(0, "Duy trì cân nặng"),
    GAIN_WEIGHT(500, "Tăng cân / Tăng cơ (dư 500 kcal/ngày)");

    private final int calorieAdjustment;
    private final String description;

    Goal(int calorieAdjustment, String description) {
        this.calorieAdjustment = calorieAdjustment;
        this.description = description;
    }

    public int getCalorieAdjustment() {
        return calorieAdjustment;
    }

    public String getDescription() {
        return description;
    }
}
