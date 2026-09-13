package com.hirena.cv.analysis.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hirena.cv.analysis.dto.CvScoreResponse;
import com.hirena.cv.analysis.exception.InvalidGeminiResponseException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
@RequiredArgsConstructor
public class GeminiResponseParser {
    private final ObjectMapper objectMapper;
    private static final Pattern MARKDOWN_JSON_PATTERN =
            Pattern.compile("^\\s*```(?:json)?\\s*(.*?)\\s*```\\s*$", Pattern.DOTALL | Pattern.CASE_INSENSITIVE);

    public CvScoreResponse parse(String json) {
        if (json == null || json.isBlank()) {
            throw new InvalidGeminiResponseException("Gemini returned an empty response");
        }

        try {
            String normalized = cleanMarkdownFences(json.trim());
            CvScoreResponse response = objectMapper.readValue(normalized, CvScoreResponse.class);
            validate(response);
            return response;
        } catch (JsonProcessingException e) {
            throw new InvalidGeminiResponseException("Gemini returned invalid JSON: " + e.getOriginalMessage(), e);
        }
    }

    private String cleanMarkdownFences(String rawText) {
        Matcher matcher = MARKDOWN_JSON_PATTERN.matcher(rawText);
        if (matcher.find()) {
            return matcher.group(1).trim();
        }
        // Fallback for cases where markdown code fences might be missing or partially formatted
        if (rawText.startsWith("```")) {
            return rawText.replaceFirst("^```(?:json)?\\s*", "")
                    .replaceFirst("\\s*```$", "")
                    .trim();
        }
        return rawText;
    }

    private void validate(CvScoreResponse response) {
        if (response == null) {
            throw new InvalidGeminiResponseException("Parsed Gemini response object is null");
        }
        if (response.getScore() < 0 || response.getScore() > 100) {
            throw new InvalidGeminiResponseException("Gemini score must be between 0 and 100");
        }
        if (response.getExperienceMatch() < 0 || response.getExperienceMatch() > 100) {
            throw new InvalidGeminiResponseException("Gemini experienceMatch must be between 0 and 100");
        }
        if (response.getSummary() == null || response.getSummary().isBlank()) {
            throw new InvalidGeminiResponseException("Gemini summary must not be empty");
        }
        requireList(response.getMatchedSkills(), "matchedSkills");
        requireList(response.getMissingSkills(), "missingSkills");
        requireList(response.getMatchedResponsibilities(), "matchedResponsibilities");
        requireList(response.getMissingResponsibilities(), "missingResponsibilities");
        requireList(response.getRecommendations(), "recommendations");
    }

    private void requireList(List<String> values, String field) {
        if (values == null) {
            throw new InvalidGeminiResponseException("Gemini field is missing: " + field);
        }
    }
}