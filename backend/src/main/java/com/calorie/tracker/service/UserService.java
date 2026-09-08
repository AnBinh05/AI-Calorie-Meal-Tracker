package com.calorie.tracker.service;

import com.calorie.tracker.dto.response.UserDto;
import com.calorie.tracker.entity.User;
import com.calorie.tracker.exception.ResourceNotFoundException;
import com.calorie.tracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final AuthService authService;

    public User getCurrentAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResourceNotFoundException("Người dùng chưa được xác thực");
        }
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thông tin người dùng: " + email));
    }

    public UserDto getCurrentUserProfile() {
        User user = getCurrentAuthenticatedUser();
        return authService.mapToUserDto(user);
    }
}
