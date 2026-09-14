package com.hirena.application.event;

import java.time.Instant;

public record ApplicationCreatedEvent(
        String eventType,
        Long applicationId,
        Long candidateId,
        Long jobId,
        Instant timestamp
) {
    public static ApplicationCreatedEvent of(Long applicationId, Long candidateId, Long jobId) {
        return new ApplicationCreatedEvent(
                "ApplicationCreated",
                applicationId,
                candidateId,
                jobId,
                Instant.now()
        );
    }
}
