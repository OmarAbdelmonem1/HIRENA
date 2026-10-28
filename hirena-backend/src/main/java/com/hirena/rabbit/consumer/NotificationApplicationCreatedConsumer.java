package com.hirena.rabbit.consumer;

import com.hirena.application.entity.Application;
import com.hirena.application.event.ApplicationCreatedEvent;
import com.hirena.application.repository.ApplicationRepository;
import com.hirena.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationApplicationCreatedConsumer {

    private final ApplicationRepository applicationRepository;
    private final NotificationService notificationService;

    @RabbitListener(queues = "${rabbitmq.queue.application-created.notification}")
    @Transactional
    public void consume(ApplicationCreatedEvent event) {
        Application application = applicationRepository.findById(event.applicationId())
                .orElseThrow(() -> new IllegalStateException(
                        "Application not found for event " + event.applicationId()));
        log.info("Creating notification for application {}", event.applicationId());
        notificationService.applicationSubmittedFromEvent(application);
    }
}
