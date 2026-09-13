package com.hirena.cv.analysis.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CvScoreResponse {
    @Min(0)
    @Max(100)
    private int score;
    private List<String> matchedSkills;
    private List<String> missingSkills;
    @Min(0)
    @Max(100)
    private int experienceMatch;
    private List<String> matchedResponsibilities;
    private List<String> missingResponsibilities;
    private List<String> recommendations;
    @NotBlank
    private String summary;
}
