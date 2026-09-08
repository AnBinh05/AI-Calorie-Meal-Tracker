package com.calorie.tracker.controller;

import com.calorie.tracker.dto.request.LoginRequest;
import com.calorie.tracker.dto.request.RegisterRequest;
import com.calorie.tracker.dto.response.ApiResponse;
import com.calorie.tracker.dto.response.AuthResponse;
import com.calorie.tracker.dto.response.UserDto;
import com.calorie.tracker.service.AuthService;
import com.calorie.tracker.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "1. Authentication", description = "Đăng ký, đăng nhập và xác thực tài khoản")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    @PostMapping("/register")
    @Operation(summary = "Đăng ký tài khoản mới")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Đăng ký tài khoản thành công", response));
    }

    @PostMapping("/login")
    @Operation(summary = "Đăng nhập với Email & Password")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("Đăng nhập thành công", response));
    }

    @GetMapping("/me")
    @Operation(summary = "Lấy thông tin tài khoản hiện tại")
    public ResponseEntity<ApiResponse<UserDto>> getMe() {
        UserDto userDto = userService.getCurrentUserProfile();
        return ResponseEntity.ok(ApiResponse.ok(userDto));
    }
}
