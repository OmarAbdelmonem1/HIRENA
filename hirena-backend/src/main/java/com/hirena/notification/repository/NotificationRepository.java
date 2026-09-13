package com.hirena.notification.repository;

import com.hirena.notification.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findAllByJobSeekerIdOrderByCreatedAtDesc(Long jobSeekerId);
    long countByJobSeekerIdAndReadAtIsNull(Long jobSeekerId);
    long deleteByJobSeekerId(Long jobSeekerId);
    boolean existsByJobSeekerIdAndApplicationIdAndType(Long jobSeekerId, Long applicationId,
                                                        com.hirena.notification.entity.NotificationType type);
}
