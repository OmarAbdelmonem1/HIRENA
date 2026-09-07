package com.hirena.jobseeker.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EducationRequest {

    @NotBlank(message = "Institution name is required")
    private String institutionName;

    @NotBlank(message = "Degree is required")
    private String degree;

    private String fieldOfStudy;

    private LocalDate startDate;

    private LocalDate endDate;

    private String grade;

    private String description;
}
