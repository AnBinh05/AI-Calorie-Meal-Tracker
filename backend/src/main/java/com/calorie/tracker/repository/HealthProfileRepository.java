package com.calorie.tracker.repository;

import com.calorie.tracker.entity.HealthProfile;
import com.calorie.tracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HealthProfileRepository extends JpaRepository<HealthProfile, Long> {
    Optional<HealthProfile> findByUser(User user);
    Optional<HealthProfile> findByUserId(Long userId);
}
