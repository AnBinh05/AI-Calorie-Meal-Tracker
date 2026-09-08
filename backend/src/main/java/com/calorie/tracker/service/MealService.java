package com.calorie.tracker.service;

import com.calorie.tracker.dto.request.CreateMealRequest;
import com.calorie.tracker.dto.request.MealItemRequest;
import com.calorie.tracker.dto.request.UpdateMealRequest;
import com.calorie.tracker.dto.response.MealDto;
import com.calorie.tracker.dto.response.MealItemDto;
import com.calorie.tracker.entity.Meal;
import com.calorie.tracker.entity.MealItem;
import com.calorie.tracker.entity.User;
import com.calorie.tracker.exception.ResourceNotFoundException;
import com.calorie.tracker.repository.MealItemRepository;
import com.calorie.tracker.repository.MealRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MealService {

    private final MealRepository mealRepository;
    private final MealItemRepository mealItemRepository;
    private final UserService userService;

    @Transactional
    public MealDto createMeal(CreateMealRequest request) {
        User user = userService.getCurrentAuthenticatedUser();

        Meal meal = Meal.builder()
                .user(user)
                .mealDate(request.getMealDate() != null ? request.getMealDate() : LocalDate.now())
                .mealType(request.getMealType())
                .name(request.getName() != null && !request.getName().isBlank() ? request.getName() : request.getMealType().getDisplayName())
                .imageUrl(request.getImageUrl())
                .healthTip(request.getHealthTip())
                .notes(request.getNotes())
                .items(new ArrayList<>())
                .build();

        if (request.getItems() != null) {
            for (MealItemRequest itemReq : request.getItems()) {
                MealItem item = MealItem.builder()
                        .name(itemReq.getName())
                        .estimatedWeightGrams(itemReq.getEstimatedWeightGrams())
                        .servingSize(itemReq.getServingSize())
                        .calories(itemReq.getCalories())
                        .protein(itemReq.getProtein() != null ? itemReq.getProtein() : 0.0)
                        .carbs(itemReq.getCarbs() != null ? itemReq.getCarbs() : 0.0)
                        .fat(itemReq.getFat() != null ? itemReq.getFat() : 0.0)
                        .fiber(itemReq.getFiber() != null ? itemReq.getFiber() : 0.0)
                        .confidenceScore(itemReq.getConfidenceScore())
                        .build();
                meal.addItem(item);
            }
        }

        meal.recalculateTotals();
        Meal savedMeal = mealRepository.save(meal);
        return mapToDto(savedMeal);
    }

    public List<MealDto> getMealsByDate(LocalDate date) {
        User user = userService.getCurrentAuthenticatedUser();
        LocalDate queryDate = (date != null) ? date : LocalDate.now();
        List<Meal> meals = mealRepository.findByUserIdAndMealDateOrderByCreatedAtDesc(user.getId(), queryDate);
        return meals.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public MealDto getMealById(Long id) {
        User user = userService.getCurrentAuthenticatedUser();
        Meal meal = mealRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bữa ăn với ID: " + id));
        return mapToDto(meal);
    }

    @Transactional
    public MealDto updateMeal(Long id, UpdateMealRequest request) {
        User user = userService.getCurrentAuthenticatedUser();
        Meal meal = mealRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bữa ăn với ID: " + id));

        if (request.getMealDate() != null) meal.setMealDate(request.getMealDate());
        if (request.getMealType() != null) meal.setMealType(request.getMealType());
        if (request.getName() != null) meal.setName(request.getName());
        if (request.getImageUrl() != null) meal.setImageUrl(request.getImageUrl());
        if (request.getHealthTip() != null) meal.setHealthTip(request.getHealthTip());
        if (request.getNotes() != null) meal.setNotes(request.getNotes());

        if (request.getItems() != null) {
            meal.getItems().clear();
            for (MealItemRequest itemReq : request.getItems()) {
                MealItem item = MealItem.builder()
                        .name(itemReq.getName())
                        .estimatedWeightGrams(itemReq.getEstimatedWeightGrams())
                        .servingSize(itemReq.getServingSize())
                        .calories(itemReq.getCalories())
                        .protein(itemReq.getProtein() != null ? itemReq.getProtein() : 0.0)
                        .carbs(itemReq.getCarbs() != null ? itemReq.getCarbs() : 0.0)
                        .fat(itemReq.getFat() != null ? itemReq.getFat() : 0.0)
                        .fiber(itemReq.getFiber() != null ? itemReq.getFiber() : 0.0)
                        .confidenceScore(itemReq.getConfidenceScore())
                        .build();
                meal.addItem(item);
            }
        }

        meal.recalculateTotals();
        Meal updatedMeal = mealRepository.save(meal);
        return mapToDto(updatedMeal);
    }

    @Transactional
    public void deleteMeal(Long id) {
        User user = userService.getCurrentAuthenticatedUser();
        Meal meal = mealRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bữa ăn với ID: " + id));
        mealRepository.delete(meal);
    }

    public MealDto mapToDto(Meal meal) {
        List<MealItemDto> itemDtos = meal.getItems().stream()
                .map(item -> MealItemDto.builder()
                        .id(item.getId())
                        .name(item.getName())
                        .estimatedWeightGrams(item.getEstimatedWeightGrams())
                        .servingSize(item.getServingSize())
                        .calories(item.getCalories())
                        .protein(item.getProtein())
                        .carbs(item.getCarbs())
                        .fat(item.getFat())
                        .fiber(item.getFiber())
                        .confidenceScore(item.getConfidenceScore())
                        .build())
                .collect(Collectors.toList());

        return MealDto.builder()
                .id(meal.getId())
                .mealDate(meal.getMealDate())
                .mealType(meal.getMealType())
                .mealTypeDisplayName(meal.getMealType().getDisplayName())
                .name(meal.getName())
                .imageUrl(meal.getImageUrl())
                .healthTip(meal.getHealthTip())
                .notes(meal.getNotes())
                .totalCalories(Math.round(meal.getTotalCalories() * 10.0) / 10.0)
                .totalProtein(Math.round(meal.getTotalProtein() * 10.0) / 10.0)
                .totalCarbs(Math.round(meal.getTotalCarbs() * 10.0) / 10.0)
                .totalFat(Math.round(meal.getTotalFat() * 10.0) / 10.0)
                .items(itemDtos)
                .createdAt(meal.getCreatedAt())
                .build();
    }
}
