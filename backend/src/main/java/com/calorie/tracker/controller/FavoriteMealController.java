package com.calorie.tracker.controller;

import com.calorie.tracker.dto.request.CreateFavoriteMealRequest;
import com.calorie.tracker.dto.request.QuickLogMealRequest;
import com.calorie.tracker.dto.request.UpdateFavoriteMealRequest;
import com.calorie.tracker.dto.response.ApiResponse;
import com.calorie.tracker.dto.response.FavoriteMealDto;
import com.calorie.tracker.dto.response.MealDto;
import com.calorie.tracker.dto.response.PageResponse;
import com.calorie.tracker.entity.MealType;
import com.calorie.tracker.service.FavoriteMealService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/meals/favorites")
@RequiredArgsConstructor
@Validated
@Tag(name = "5. Favorite Meals", description = "Quản lý danh sách món ăn yêu thích và ghi nhận nhanh vào nhật ký")
public class FavoriteMealController {

    private final FavoriteMealService favoriteMealService;

    @GetMapping
    @Operation(summary = "Lấy danh sách món ăn yêu thích (hỗ trợ phân trang, lọc theo loại bữa ăn và tìm kiếm theo tên)")
    public ResponseEntity<ApiResponse<PageResponse<FavoriteMealDto>>> getFavoriteMeals(
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "mealType", required = false) MealType mealType,
            @PageableDefault(size = 10, sort = "usageCount", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        PageResponse<FavoriteMealDto> response = favoriteMealService.getFavoriteMeals(keyword, mealType, pageable);
        return ResponseEntity.ok(ApiResponse.ok("Lấy danh sách món ăn yêu thích thành công", response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy thông tin chi tiết một món ăn yêu thích theo ID")
    public ResponseEntity<ApiResponse<FavoriteMealDto>> getFavoriteMealById(
            @PathVariable @Positive(message = "ID món yêu thích phải là số nguyên dương") Long id
    ) {
        FavoriteMealDto response = favoriteMealService.getFavoriteMealById(id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping
    @Operation(summary = "Tạo mới một món ăn yêu thích thủ công kèm các món con")
    public ResponseEntity<ApiResponse<FavoriteMealDto>> createFavoriteMeal(
            @Valid @RequestBody CreateFavoriteMealRequest request
    ) {
        FavoriteMealDto response = favoriteMealService.createFavoriteMeal(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Thêm món ăn vào danh sách yêu thích thành công", response));
    }

    @PostMapping("/from-meal/{mealId}")
    @Operation(summary = "Lưu nhanh (Bookmark) từ một bữa ăn đã log trong nhật ký thành món ăn yêu thích")
    public ResponseEntity<ApiResponse<FavoriteMealDto>> createFavoriteMealFromExistingMeal(
            @PathVariable @Positive(message = "ID bữa ăn gốc phải là số nguyên dương") Long mealId,
            @RequestParam(value = "customName", required = false) String customName
    ) {
        FavoriteMealDto response = favoriteMealService.createFavoriteMealFromExistingMeal(mealId, customName);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Đã lưu bữa ăn vào danh sách món yêu thích", response));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật thông tin món ăn yêu thích")
    public ResponseEntity<ApiResponse<FavoriteMealDto>> updateFavoriteMeal(
            @PathVariable @Positive(message = "ID món yêu thích phải là số nguyên dương") Long id,
            @Valid @RequestBody UpdateFavoriteMealRequest request
    ) {
        FavoriteMealDto response = favoriteMealService.updateFavoriteMeal(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật món ăn yêu thích thành công", response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa một món khỏi danh sách yêu thích")
    public ResponseEntity<ApiResponse<Void>> deleteFavoriteMeal(
            @PathVariable @Positive(message = "ID món yêu thích phải là số nguyên dương") Long id
    ) {
        favoriteMealService.deleteFavoriteMeal(id);
        return ResponseEntity.ok(ApiResponse.ok("Đã xóa món ăn khỏi danh sách yêu thích", null));
    }

    @PostMapping("/{id}/log")
    @Operation(summary = "Ghi nhận nhanh (Quick Log) món yêu thích này vào nhật ký bữa ăn hôm nay")
    public ResponseEntity<ApiResponse<MealDto>> quickLogFavoriteMeal(
            @PathVariable @Positive(message = "ID món yêu thích phải là số nguyên dương") Long id,
            @RequestBody(required = false) QuickLogMealRequest request
    ) {
        MealDto response = favoriteMealService.quickLogFavoriteMeal(id, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Đã ghi nhận món ăn yêu thích vào nhật ký bữa ăn", response));
    }
}
