package com.hirena.rabbit.producer;

import com.hirena.application.entity.Application;
import com.hirena.application.event.ApplicationCreatedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.amqp.AmqpException;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ApplicationEventProducer {

    private final RabbitTemplate rabbitTemplate;

    @Value("${rabbitmq.exchange.application-events}")
    private String applicationEventsExchange;

    @Value("${rabbitmq.routing-key.application-created}")
    private String applicationCreatedRoutingKey;

    public void publishApplicationCreated(Application application) {
        ApplicationCreatedEvent event = ApplicationCreatedEvent.of(
                application.getId(),
                application.getJobSeeker().getId(),
                application.getJob().getId()
        );
        try {
            rabbitTemplate.convertAndSend(
                    applicationEventsExchange, applicationCreatedRoutingKey, event);
            log.debug("Published {} for application {} to exchange {} with routing key {}",
                    event.eventType(), event.applicationId(),
                    applicationEventsExchange, applicationCreatedRoutingKey);
        } catch (AmqpException exception) {
            log.error("Failed to publish {} for application {}",
                    event.eventType(), event.applicationId(), exception);
        }
    }
}
