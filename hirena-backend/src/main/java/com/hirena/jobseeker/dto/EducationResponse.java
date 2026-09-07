package com.hirena.jobseeker.dto;

import com.hirena.jobseeker.entity.Education;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EducationResponse {

    private Long id;
    private String institutionName;
    private String degree;
    private String fieldOfStudy;
    private LocalDate startDate;
    private LocalDate endDate;
    private String grade;
    private String description;

    public static EducationResponse fromEntity(Education e) {
        return EducationResponse.builder()
                .id(e.getId())
                .institutionName(e.getInstitutionName())
                .degree(e.getDegree())
                .fieldOfStudy(e.getFieldOfStudy())
                .startDate(e.getStartDate())
                .endDate(e.getEndDate())
                .grade(e.getGrade())
                .description(e.getDescription())
                .build();
    }
}
