package com.calorie.tracker.service;

import com.calorie.tracker.config.JwtService;
import com.calorie.tracker.dto.request.LoginRequest;
import com.calorie.tracker.dto.request.RegisterRequest;
import com.calorie.tracker.dto.response.AuthResponse;
import com.calorie.tracker.dto.response.UserDto;
import com.calorie.tracker.entity.Role;
import com.calorie.tracker.entity.User;
import com.calorie.tracker.exception.BadRequestException;
import com.calorie.tracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email đã được sử dụng bởi tài khoản khác");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail().toLowerCase().trim())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.ROLE_USER)
                .build();

        User savedUser = userRepository.save(user);
        String jwtToken = jwtService.generateToken(savedUser);

        return AuthResponse.builder()
                .token(jwtToken)
                .tokenType("Bearer")
                .expiresInMs(jwtService.getExpirationTime())
                .user(mapToUserDto(savedUser))
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail().toLowerCase().trim(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new BadRequestException("Email hoặc mật khẩu không chính xác"));

        String jwtToken = jwtService.generateToken(user);

        return AuthResponse.builder()
                .token(jwtToken)
                .tokenType("Bearer")
                .expiresInMs(jwtService.getExpirationTime())
                .user(mapToUserDto(user))
                .build();
    }

    public UserDto mapToUserDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole())
                .hasHealthProfile(user.getHealthProfile() != null)
                .createdAt(user.getCreatedAt())
                .build();
    }
}
