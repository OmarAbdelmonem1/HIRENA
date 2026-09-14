package com.hirena.notification.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * Sends plain-text email notifications without blocking business operations.
 *
 * <p>Email delivery is disabled unless {@code app.mail.enabled=true}. When enabled,
 * {@code spring.mail.password} must be a valid 16-character Gmail App Password
 * supplied through {@code MAIL_PASSWORD}; a regular Gmail account password will
 * fail SMTP authentication. The configured Gmail account must have 2-Step
 * Verification enabled and an App Password generated in Google Account >
 * Security > App passwords.</p>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationEmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.enabled:false}")
    private boolean mailEnabled;

    @Value("${app.mail.from:${spring.mail.username:}}")
    private String fromAddress;

    @Value("${app.mail.subject-prefix:}")
    private String subjectPrefix;

    /**
     * Queues a plain-text notification email for asynchronous delivery.
     *
     * @param toAddress recipient email address
     * @param subject email subject without the configured prefix
     * @param body plain-text email body
     */
    @Async("notificationTaskExecutor")
    public void sendNotificationEmail(String toAddress, String subject, String body) {
        if (!mailEnabled) {
            log.debug("Email notifications are disabled; skipping recipient {}", toAddress);
            return;
        }
        if (toAddress == null || toAddress.isBlank()) {
            log.warn("Skipping notification email because the recipient address is blank");
            return;
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toAddress);
        if (fromAddress != null && !fromAddress.isBlank()) {
            message.setFrom(fromAddress);
        }
        message.setSubject(buildSubject(subject));
        message.setText(body == null ? "" : body);

        try {
            mailSender.send(message);
        } catch (MailException exception) {
            log.warn("Notification email failed for recipient {}: {}",
                    toAddress, rootCauseMessage(exception));
        }
    }

    private String buildSubject(String subject) {
        String prefix = subjectPrefix == null ? "" : subjectPrefix.trim();
        String value = subject == null ? "" : subject.trim();
        return prefix.isEmpty() ? value : prefix + " " + value;
    }

    private String rootCauseMessage(Throwable exception) {
        Throwable rootCause = exception;
        while (rootCause.getCause() != null) {
            rootCause = rootCause.getCause();
        }
        return rootCause.getMessage() == null
                ? rootCause.getClass().getSimpleName()
                : rootCause.getMessage();
    }
}
