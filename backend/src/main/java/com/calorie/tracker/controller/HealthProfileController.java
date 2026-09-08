package com.calorie.tracker.controller;

import com.calorie.tracker.dto.request.HealthProfileRequest;
import com.calorie.tracker.dto.response.ApiResponse;
import com.calorie.tracker.dto.response.HealthProfileDto;
import com.calorie.tracker.service.HealthProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/profile")
@RequiredArgsConstructor
@Tag(name = "2. Health Profile", description = "Quản lý hồ sơ sức khỏe và tính toán BMR / TDEE")
public class HealthProfileController {

    private final HealthProfileService healthProfileService;

    @GetMapping
    @Operation(summary = "Lấy hồ sơ sức khỏe của người dùng hiện tại")
    public ResponseEntity<ApiResponse<HealthProfileDto>> getProfile() {
        HealthProfileDto profile = healthProfileService.getMyProfile();
        return ResponseEntity.ok(ApiResponse.ok(profile));
    }

    @PostMapping
    @Operation(summary = "Tạo mới hoặc cập nhật hồ sơ sức khỏe & mục tiêu calories/macros")
    public ResponseEntity<ApiResponse<HealthProfileDto>> upsertProfile(@Valid @RequestBody HealthProfileRequest request) {
        HealthProfileDto profile = healthProfileService.upsertMyProfile(request);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật hồ sơ sức khỏe thành công", profile));
    }
}
