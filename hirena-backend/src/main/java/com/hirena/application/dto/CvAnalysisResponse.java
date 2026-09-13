package com.hirena.application.dto;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hirena.application.entity.CvAnalysis;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class CvAnalysisResponse {
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    private Long id;
    private String status;
    private Integer score;
    private Integer experienceMatch;
    private List<String> matchedSkills;
    private List<String> missingSkills;
    private List<String> matchedResponsibilities;
    private List<String> missingResponsibilities;
    private List<String> recommendations;
    private String summary;
    private String error;
    private LocalDateTime analyzedAt;

    public static CvAnalysisResponse fromEntity(CvAnalysis analysis) {
        return CvAnalysisResponse.builder()
                .id(analysis.getId())
                .status(analysis.getStatus().name())
                .score(analysis.getScore())
                .experienceMatch(analysis.getExperienceMatch())
                .matchedSkills(readList(analysis.getMatchedSkills()))
                .missingSkills(readList(analysis.getMissingSkills()))
                .matchedResponsibilities(readList(analysis.getMatchedResponsibilities()))
                .missingResponsibilities(readList(analysis.getMissingResponsibilities()))
                .recommendations(readList(analysis.getRecommendations()))
                .summary(analysis.getSummary())
                .error(analysis.getError())
                .analyzedAt(analysis.getAnalyzedAt())
                .build();
    }

    private static List<String> readList(String value) {
        if (value == null || value.isBlank()) {
            return List.of();
        }
        try {
            return OBJECT_MAPPER.readValue(value, new TypeReference<>() {});
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Stored CV analysis data is invalid", e);
        }
    }
}
