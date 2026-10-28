package com.hirena.rabbit.consumer;

import com.hirena.application.entity.Application;
import com.hirena.application.event.ApplicationCreatedEvent;
import com.hirena.application.repository.ApplicationRepository;
import com.hirena.notification.service.NotificationEmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Slf4j
public class EmailApplicationCreatedConsumer {

    private final ApplicationRepository applicationRepository;
    private final NotificationEmailService emailService;

    @RabbitListener(queues = "${rabbitmq.queue.application-created.email}")
    @Transactional(readOnly = true)
    public void consume(ApplicationCreatedEvent event) {
        Application application = applicationRepository.findById(event.applicationId())
                .orElseThrow(() -> new IllegalStateException(
                        "Application not found for event " + event.applicationId()));
        String recipient = application.getJobSeeker().getUser().getEmail();
        String subject = "Application submitted";
        String body = "Your application for " + application.getJob().getTitle()
                + " was submitted successfully.";
        log.info("Sending email notification for application {}", event.applicationId());
        emailService.sendNotificationEmail(recipient, subject, body);
    }
}
