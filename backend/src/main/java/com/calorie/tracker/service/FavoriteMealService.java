package com.calorie.tracker.service;

import com.calorie.tracker.dto.request.CreateFavoriteMealRequest;
import com.calorie.tracker.dto.request.MealItemRequest;
import com.calorie.tracker.dto.request.QuickLogMealRequest;
import com.calorie.tracker.dto.request.UpdateFavoriteMealRequest;
import com.calorie.tracker.dto.response.FavoriteMealDto;
import com.calorie.tracker.dto.response.MealDto;
import com.calorie.tracker.dto.response.MealItemDto;
import com.calorie.tracker.dto.response.PageResponse;
import com.calorie.tracker.entity.*;
import com.calorie.tracker.exception.BadRequestException;
import com.calorie.tracker.exception.ResourceNotFoundException;
import com.calorie.tracker.repository.FavoriteMealRepository;
import com.calorie.tracker.repository.MealRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FavoriteMealService {

    private final FavoriteMealRepository favoriteMealRepository;
    private final MealRepository mealRepository;
    private final UserService userService;
    private final MealService mealService;

    public PageResponse<FavoriteMealDto> getFavoriteMeals(String keyword, MealType mealType, Pageable pageable) {
        User user = userService.getCurrentAuthenticatedUser();
        String searchKey = (keyword != null && !keyword.trim().isEmpty()) ? keyword.trim() : null;

        Page<FavoriteMeal> page = favoriteMealRepository.searchFavorites(user.getId(), mealType, searchKey, pageable);
        Page<FavoriteMealDto> dtoPage = page.map(this::mapToDto);

        return PageResponse.of(dtoPage);
    }

    public FavoriteMealDto getFavoriteMealById(Long id) {
        User user = userService.getCurrentAuthenticatedUser();
        FavoriteMeal favoriteMeal = favoriteMealRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy món ăn yêu thích với ID: " + id));
        return mapToDto(favoriteMeal);
    }

    @Transactional
    public FavoriteMealDto createFavoriteMeal(CreateFavoriteMealRequest request) {
        User user = userService.getCurrentAuthenticatedUser();

        if (favoriteMealRepository.existsByUserIdAndNameIgnoreCase(user.getId(), request.getName().trim())) {
            throw new BadRequestException("Món ăn yêu thích với tên này đã tồn tại trong danh sách của bạn");
        }

        FavoriteMeal favoriteMeal = FavoriteMeal.builder()
                .user(user)
                .name(request.getName().trim())
                .mealType(request.getMealType())
                .imageUrl(request.getImageUrl())
                .notes(request.getNotes())
                .usageCount(0)
                .items(new ArrayList<>())
                .build();

        if (request.getItems() != null) {
            for (MealItemRequest itemReq : request.getItems()) {
                FavoriteMealItem item = FavoriteMealItem.builder()
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
                favoriteMeal.addItem(item);
            }
        }

        favoriteMeal.recalculateTotals();
        FavoriteMeal saved = favoriteMealRepository.save(favoriteMeal);
        return mapToDto(saved);
    }

    @Transactional
    public FavoriteMealDto createFavoriteMealFromExistingMeal(Long mealId, String customName) {
        User user = userService.getCurrentAuthenticatedUser();

        Meal meal = mealRepository.findByIdAndUserId(mealId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bữa ăn gốc với ID: " + mealId));

        String favoriteName = (customName != null && !customName.trim().isEmpty())
                ? customName.trim()
                : meal.getName();

        if (favoriteName == null || favoriteName.isBlank()) {
            favoriteName = meal.getMealType().getDisplayName();
        }

        if (favoriteMealRepository.existsByUserIdAndNameIgnoreCase(user.getId(), favoriteName)) {
            favoriteName = favoriteName + " (" + LocalDate.now() + ")";
        }

        FavoriteMeal favoriteMeal = FavoriteMeal.builder()
                .user(user)
                .name(favoriteName)
                .mealType(meal.getMealType())
                .imageUrl(meal.getImageUrl())
                .notes(meal.getNotes() != null ? meal.getNotes() : "Được lưu từ bữa ăn ngày " + meal.getMealDate())
                .usageCount(1)
                .items(new ArrayList<>())
                .build();

        if (meal.getItems() != null) {
            for (MealItem mItem : meal.getItems()) {
                FavoriteMealItem fItem = FavoriteMealItem.builder()
                        .name(mItem.getName())
                        .estimatedWeightGrams(mItem.getEstimatedWeightGrams())
                        .servingSize(mItem.getServingSize())
                        .calories(mItem.getCalories())
                        .protein(mItem.getProtein())
                        .carbs(mItem.getCarbs())
                        .fat(mItem.getFat())
                        .fiber(mItem.getFiber())
                        .confidenceScore(mItem.getConfidenceScore())
                        .build();
                favoriteMeal.addItem(fItem);
            }
        }

        favoriteMeal.recalculateTotals();
        FavoriteMeal saved = favoriteMealRepository.save(favoriteMeal);
        return mapToDto(saved);
    }

    @Transactional
    public FavoriteMealDto updateFavoriteMeal(Long id, UpdateFavoriteMealRequest request) {
        User user = userService.getCurrentAuthenticatedUser();

        FavoriteMeal favoriteMeal = favoriteMealRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy món ăn yêu thích với ID: " + id));

        if (!favoriteMeal.getName().equalsIgnoreCase(request.getName().trim()) &&
                favoriteMealRepository.existsByUserIdAndNameIgnoreCase(user.getId(), request.getName().trim())) {
            throw new BadRequestException("Món ăn yêu thích với tên này đã tồn tại trong danh sách của bạn");
        }

        favoriteMeal.setName(request.getName().trim());
        favoriteMeal.setMealType(request.getMealType());
        if (request.getImageUrl() != null) favoriteMeal.setImageUrl(request.getImageUrl());
        if (request.getNotes() != null) favoriteMeal.setNotes(request.getNotes());

        if (request.getItems() != null) {
            favoriteMeal.getItems().clear();
            for (MealItemRequest itemReq : request.getItems()) {
                FavoriteMealItem item = FavoriteMealItem.builder()
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
                favoriteMeal.addItem(item);
            }
        }

        favoriteMeal.recalculateTotals();
        FavoriteMeal updated = favoriteMealRepository.save(favoriteMeal);
        return mapToDto(updated);
    }

    @Transactional
    public void deleteFavoriteMeal(Long id) {
        User user = userService.getCurrentAuthenticatedUser();

        FavoriteMeal favoriteMeal = favoriteMealRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy món ăn yêu thích với ID: " + id));

        favoriteMealRepository.delete(favoriteMeal);
    }

    @Transactional
    public MealDto quickLogFavoriteMeal(Long id, QuickLogMealRequest request) {
        User user = userService.getCurrentAuthenticatedUser();

        FavoriteMeal favoriteMeal = favoriteMealRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy món ăn yêu thích với ID: " + id));

        LocalDate mealDate = (request != null && request.getMealDate() != null)
                ? request.getMealDate()
                : LocalDate.now();

        MealType mealType = (request != null && request.getMealType() != null)
                ? request.getMealType()
                : favoriteMeal.getMealType();

        String notes = (request != null && request.getNotes() != null && !request.getNotes().isBlank())
                ? request.getNotes()
                : favoriteMeal.getNotes();

        Meal newMeal = Meal.builder()
                .user(user)
                .mealDate(mealDate)
                .mealType(mealType)
                .name(favoriteMeal.getName())
                .imageUrl(favoriteMeal.getImageUrl())
                .notes(notes)
                .items(new ArrayList<>())
                .build();

        if (favoriteMeal.getItems() != null) {
            for (FavoriteMealItem fItem : favoriteMeal.getItems()) {
                MealItem mItem = MealItem.builder()
                        .name(fItem.getName())
                        .estimatedWeightGrams(fItem.getEstimatedWeightGrams())
                        .servingSize(fItem.getServingSize())
                        .calories(fItem.getCalories())
                        .protein(fItem.getProtein())
                        .carbs(fItem.getCarbs())
                        .fat(fItem.getFat())
                        .fiber(fItem.getFiber())
                        .confidenceScore(fItem.getConfidenceScore())
                        .build();
                newMeal.addItem(mItem);
            }
        }

        newMeal.recalculateTotals();
        Meal savedMeal = mealRepository.save(newMeal);

        favoriteMeal.incrementUsageCount();
        favoriteMealRepository.save(favoriteMeal);

        return mealService.mapToDto(savedMeal);
    }

    public FavoriteMealDto mapToDto(FavoriteMeal favoriteMeal) {
        List<MealItemDto> itemDtos = (favoriteMeal.getItems() != null)
                ? favoriteMeal.getItems().stream()
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
                .collect(Collectors.toList())
                : Collections.emptyList();

        return FavoriteMealDto.builder()
                .id(favoriteMeal.getId())
                .name(favoriteMeal.getName())
                .mealType(favoriteMeal.getMealType())
                .mealTypeDisplayName(favoriteMeal.getMealType().getDisplayName())
                .imageUrl(favoriteMeal.getImageUrl())
                .notes(favoriteMeal.getNotes())
                .totalCalories(Math.round(favoriteMeal.getTotalCalories() * 10.0) / 10.0)
                .totalProtein(Math.round(favoriteMeal.getTotalProtein() * 10.0) / 10.0)
                .totalCarbs(Math.round(favoriteMeal.getTotalCarbs() * 10.0) / 10.0)
                .totalFat(Math.round(favoriteMeal.getTotalFat() * 10.0) / 10.0)
                .usageCount(favoriteMeal.getUsageCount() != null ? favoriteMeal.getUsageCount() : 0)
                .itemsCount(itemDtos.size())
                .items(itemDtos)
                .createdAt(favoriteMeal.getCreatedAt())
                .updatedAt(favoriteMeal.getUpdatedAt())
                .build();
    }
}
