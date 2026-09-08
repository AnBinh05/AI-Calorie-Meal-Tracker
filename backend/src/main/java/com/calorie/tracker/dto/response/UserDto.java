package com.calorie.tracker.dto.response;

import com.calorie.tracker.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {

    private Long id;
    private String email;
    private String fullName;
    private String avatarUrl;
    private Role role;
    private boolean hasHealthProfile;
    private LocalDateTime createdAt;
}
