package com.hirena.job.dto;

import com.hirena.job.entity.EmploymentType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class JobRequest {

    @NotBlank(message = "Job title is required")
    @Size(max = 255, message = "Title must not exceed 255 characters")
    private String title;

    @NotBlank(message = "Job description is required")
    private String description;

    private String requirements;
    private String location;
    private BigDecimal salaryMin;
    private BigDecimal salaryMax;

    @NotNull(message = "Employment type is required")
    private EmploymentType employmentType;

    private Integer experienceRequired;
    private LocalDate deadline;
}
