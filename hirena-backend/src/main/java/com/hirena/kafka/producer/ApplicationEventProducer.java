package com.hirena.kafka.producer;

import com.hirena.application.entity.Application;
import com.hirena.application.event.ApplicationCreatedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ApplicationEventProducer {

    private final KafkaTemplate<String, ApplicationCreatedEvent> kafkaTemplate;

    @Value("${kafka.topic.application-created}")
    private String applicationCreatedTopic;

    public void publishApplicationCreated(Application application) {
        ApplicationCreatedEvent event = ApplicationCreatedEvent.of(
                application.getId(),
                application.getJobSeeker().getId(),
                application.getJob().getId()
        );
        String key = String.valueOf(application.getJobSeeker().getId());
        kafkaTemplate.send(applicationCreatedTopic, key, event)
                .whenComplete((result, exception) -> {
                    if (exception != null) {
                        log.error("Failed to publish {} for application {}",
                                event.eventType(), event.applicationId(), exception);
                    } else {
                        log.debug("Published {} for application {} to {}-{}",
                                event.eventType(), event.applicationId(),
                                result.getRecordMetadata().topic(),
                                result.getRecordMetadata().partition());
                    }
                });
    }
}
