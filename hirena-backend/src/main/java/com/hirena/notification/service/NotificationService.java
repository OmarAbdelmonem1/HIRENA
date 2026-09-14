package com.hirena.notification.service;

import com.hirena.auth.security.CurrentUserProvider;
import com.hirena.application.entity.Application;
import com.hirena.exception.ResourceNotFoundException;
import com.hirena.jobseeker.entity.JobSeeker;
import com.hirena.jobseeker.repository.JobSeekerRepository;
import com.hirena.notification.dto.NotificationResponse;
import com.hirena.notification.entity.Notification;
import com.hirena.notification.entity.NotificationType;
import com.hirena.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final JobSeekerRepository jobSeekerRepository;
    private final CurrentUserProvider currentUserProvider;
    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationEmailService notificationEmailService;

    public void applicationSubmitted(Application application) {
        save(application, NotificationType.APPLICATION_SUBMITTED,
                "Application submitted",
                "Your application for " + application.getJob().getTitle() + " was submitted successfully.",
                false);
    }

    public void applicationSubmittedFromKafka(Application application) {
        applicationSubmitted(application);
    }

    public void applicationStatusChanged(Application application) {
        String status = application.getStatus().name().toLowerCase();
        save(application, NotificationType.APPLICATION_STATUS_CHANGED,
                "Application status updated",
                "Your application for " + application.getJob().getTitle() + " was " + status + ".",
                true);
    }

    public void applicationViewed(Application application) {
        save(application, NotificationType.APPLICATION_VIEWED, "Application viewed",
                application.getJob().getCompany().getCompanyName() + " viewed your application for "
                        + application.getJob().getTitle() + ".",
                true);
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> getMyNotifications() {
        return notificationRepository.findAllByJobSeekerIdOrderByCreatedAtDesc(currentJobSeeker().getId())
                .stream().map(NotificationResponse::fromEntity).toList();
    }

    @Transactional(readOnly = true)
    public long countUnread() {
        return notificationRepository.countByJobSeekerIdAndReadAtIsNull(currentJobSeeker().getId());
    }

    @Transactional
    public void markAsRead(Long notificationId) {
        Notification notification = getOwnedNotification(notificationId);
        if (notification.getReadAt() == null) {
            notification.setReadAt(LocalDateTime.now());
        }
    }

    @Transactional
    public void delete(Long notificationId) {
        notificationRepository.delete(getOwnedNotification(notificationId));
    }

    @Transactional
    public void deleteAll() {
        notificationRepository.deleteByJobSeekerId(currentJobSeeker().getId());
    }

    private Notification getOwnedNotification(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        if (notification.getJobSeeker() == null
                || !notification.getJobSeeker().getUser().getId()
                .equals(currentUserProvider.getCurrentUserId())) {
            throw new ResourceNotFoundException("Notification not found");
        }
        return notification;
    }

    private void save(Application application, NotificationType type, String title,
                      String message, boolean sendEmailEnabled) {
        if (notificationRepository.existsByJobSeekerIdAndApplicationIdAndType(
                application.getJobSeeker().getId(), application.getId(), type)) {
            return;
        }
        Notification notification = notificationRepository.save(Notification.builder()
                .jobSeeker(application.getJobSeeker())
                .type(type)
                .title(title)
                .message(message)
                .applicationId(application.getId())
                .jobId(application.getJob().getId())
                .build());
        String recipientEmail = application.getJobSeeker().getUser().getEmail();
        NotificationResponse notificationResponse = NotificationResponse.fromEntity(notification);
        Runnable publish = () -> messagingTemplate.convertAndSendToUser(
                recipientEmail,
                "/queue/notifications",
                notificationResponse
        );
        Runnable sendEmail = () -> {
            if (sendEmailEnabled) {
                notificationEmailService.sendNotificationEmail(recipientEmail, title, message);
            }
        };
        if (TransactionSynchronizationManager.isSynchronizationActive()) {
            TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
                @Override
                public void afterCommit() {
                    publish.run();
                    sendEmail.run();
                }
            });
        } else {
            publish.run();
            sendEmail.run();
        }
    }

    private JobSeeker currentJobSeeker() {
        return jobSeekerRepository.findByUserId(currentUserProvider.getCurrentUserId())
                .orElseThrow(() -> new IllegalStateException("Job seeker profile not found"));
    }
}
