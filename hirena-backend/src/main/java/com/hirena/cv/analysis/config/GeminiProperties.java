package com.hirena.cv.analysis.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.time.Duration;

@Getter
@Setter
@ConfigurationProperties(prefix = "gemini")
public class GeminiProperties {
    private String apiKey;
    private String apiUrl = "https://generativelanguage.googleapis.com";
    private String model = "gemini-3.6-flash";
    private Duration connectTimeout = Duration.ofSeconds(5);
    private Duration readTimeout = Duration.ofSeconds(45);
    private long maxCvSizeBytes = 5 * 1024 * 1024;
}