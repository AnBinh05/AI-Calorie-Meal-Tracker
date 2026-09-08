package com.calorie.tracker.entity;

public enum ActivityLevel {
    SEDENTARY(1.2, "Ít vận động (làm việc văn phòng, ít tập thể dục)"),
    LIGHTLY_ACTIVE(1.375, "Vận động nhẹ (tập luyện 1-3 ngày/tuần)"),
    MODERATELY_ACTIVE(1.55, "Vận động vừa (tập luyện 3-5 ngày/tuần)"),
    VERY_ACTIVE(1.725, "Vận động nhiều (tập luyện 6-7 ngày/tuần)"),
    EXTRA_ACTIVE(1.9, "Vận động cực nhiều (vận động viên, lao động nặng)");

    private final double multiplier;
    private final String description;

    ActivityLevel(double multiplier, String description) {
        this.multiplier = multiplier;
        this.description = description;
    }

    public double getMultiplier() {
        return multiplier;
    }

    public String getDescription() {
        return description;
    }
}
