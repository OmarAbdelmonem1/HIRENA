package com.hirena.job.dto;

import com.hirena.job.entity.EmploymentType;
import com.hirena.job.entity.Job;
import com.hirena.job.entity.JobStatus;
import com.hirena.job.entity.JobCategory;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder(toBuilder = true)
public class JobResponse {

    private Long id;
    private Long companyId;
    private String companyName;
    private String companyLogo;
    private String title;
    private String description;
    private String requirements;
    private String location;
    private BigDecimal salaryMin;
    private BigDecimal salaryMax;
    private EmploymentType employmentType;
    private JobCategory category;
    private Integer experienceRequired;
    private LocalDate deadline;
    private JobStatus status;
    private String rejectionReason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private long uniqueViewers;

    public static JobResponse fromEntity(Job job) {
        return JobResponse.builder()
                .id(job.getId())
                .companyId(job.getCompany().getId())
                .companyName(job.getCompany().getCompanyName())
                .companyLogo(job.getCompany().getLogo())
                .title(job.getTitle())
                .description(job.getDescription())
                .requirements(job.getRequirements())
                .location(job.getLocation())
                .salaryMin(job.getSalaryMin())
                .salaryMax(job.getSalaryMax())
                .employmentType(job.getEmploymentType())
                .category(job.getCategory())
                .experienceRequired(job.getExperienceRequired())
                .deadline(job.getDeadline())
                .status(job.getStatus())
                .rejectionReason(job.getRejectionReason())
                .createdAt(job.getCreatedAt())
                .updatedAt(job.getUpdatedAt())
                .build();
    }
}
