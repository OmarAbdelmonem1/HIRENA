package com.hirena.cv.analysis.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hirena.cv.analysis.config.GeminiProperties;
import com.hirena.cv.analysis.dto.GeminiGenerateContentRequest;
import com.hirena.cv.analysis.dto.GeminiGenerateContentResponse;
import com.hirena.cv.analysis.exception.GeminiApiException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.net.http.HttpClient;
import java.util.List;

@Slf4j
@Service
public class GeminiService {
    private final GeminiProperties properties;
    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    public GeminiService(GeminiProperties properties, RestClient.Builder restClientBuilder, ObjectMapper objectMapper) {
        this.properties = properties;
        this.objectMapper = objectMapper;

        HttpClient httpClient = HttpClient.newBuilder()
                .connectTimeout(properties.getConnectTimeout())
                .build();
        
        JdkClientHttpRequestFactory requestFactory = new JdkClientHttpRequestFactory(httpClient);
        requestFactory.setReadTimeout(properties.getReadTimeout());
        
        log.info("Gemini client configured with base URL {} and model {}",
                properties.getApiUrl(), properties.getModel());
        log.info("Gemini API key configured: {}",
                properties.getApiKey() != null && !properties.getApiKey().isBlank());

        this.restClient = restClientBuilder
                .baseUrl(properties.getApiUrl())
                .requestFactory(requestFactory)
                .build();
    }

    public String generate(String prompt) {
        if (properties.getApiKey() == null || properties.getApiKey().isBlank()) {
            throw new GeminiApiException("Gemini API key is not configured");
        }

        GeminiGenerateContentRequest request = new GeminiGenerateContentRequest(
                List.of(new GeminiGenerateContentRequest.Content(
                        List.of(new GeminiGenerateContentRequest.Part(prompt))
                )),
                new GeminiGenerateContentRequest.GenerationConfig("application/json", 0.2)
        );

        try {
            GeminiGenerateContentResponse response = restClient.post()
                    .uri("/v1beta/models/" + properties.getModel() + ":generateContent")
                    .header("x-goog-api-key", properties.getApiKey())
                    .body(request)
                    .retrieve()
                    .body(GeminiGenerateContentResponse.class);

            if (response == null || response.candidates() == null
                    || response.candidates().isEmpty()
                    || response.candidates().get(0).content() == null
                    || response.candidates().get(0).content().parts() == null
                    || response.candidates().get(0).content().parts().isEmpty()) {
                throw new GeminiApiException("Gemini returned no analysis content");
            }
            return response.candidates().get(0).content().parts().get(0).text();
        } catch (RestClientResponseException e) {
            HttpStatusCode status = e.getStatusCode();
            String responseBody = e.getResponseBodyAsString();
            log.warn("Gemini request failed with status {}: {}", status.value(), responseBody);
            
            if (status.value() == 429) {
                throw new GeminiApiException("Gemini rate limit exceeded: " + responseBody, status);
            }
            
            throw new GeminiApiException("Gemini API request failed (" + status.value() + ") for model "
                    + properties.getModel() + ": " + extractProviderMessage(responseBody), status);
        } catch (GeminiApiException e) {
            throw e;
        } catch (RuntimeException e) {
            log.error("Gemini request failed", e);
            throw new GeminiApiException("Gemini API is unavailable or timed out", e);
        }
    }

    private String extractProviderMessage(String responseBody) {
        if (responseBody == null || responseBody.isBlank()) {
            return "the provider returned no details";
        }
        try {
            JsonNode rootNode = objectMapper.readTree(responseBody);
            JsonNode messageNode = rootNode.at("/error/message");
            if (!messageNode.isMissingNode() && !messageNode.asText().isBlank()) {
                return messageNode.asText();
            }
        } catch (Exception e) {
            log.debug("Failed to parse Gemini error response JSON", e);
        }
        return responseBody.length() > 300 ? responseBody.substring(0, 300) : responseBody;
    }
}