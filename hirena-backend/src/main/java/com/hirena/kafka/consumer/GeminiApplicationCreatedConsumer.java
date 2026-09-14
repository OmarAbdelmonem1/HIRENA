package com.hirena.kafka.consumer;

import com.hirena.application.event.ApplicationCreatedEvent;
import com.hirena.application.service.ApplicationCvAnalysisAsyncService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class GeminiApplicationCreatedConsumer {

    private final ApplicationCvAnalysisAsyncService analysisService;

    @KafkaListener(
            topics = "${kafka.topic.application-created}",
            groupId = "${kafka.consumer.gemini-group}",
            containerFactory = "applicationEventKafkaListenerContainerFactory"
    )
    public void consume(ApplicationCreatedEvent event) {
        log.info("Received {} for Gemini analysis, application {}",
                event.eventType(), event.applicationId());
        analysisService.analyzeSynchronously(event.applicationId());
    }
}
