package com.hirena.jobseeker.dto;

import com.hirena.jobseeker.entity.WorkExperience;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkExperienceResponse {

    private Long id;
    private String companyName;
    private String jobTitle;
    private String location;
    private LocalDate startDate;
    private LocalDate endDate;
    private boolean currentlyWorking;
    private String description;

    public static WorkExperienceResponse fromEntity(WorkExperience w) {
        return WorkExperienceResponse.builder()
                .id(w.getId())
                .companyName(w.getCompanyName())
                .jobTitle(w.getJobTitle())
                .location(w.getLocation())
                .startDate(w.getStartDate())
                .endDate(w.getEndDate())
                .currentlyWorking(w.isCurrentlyWorking())
                .description(w.getDescription())
                .build();
    }
}
