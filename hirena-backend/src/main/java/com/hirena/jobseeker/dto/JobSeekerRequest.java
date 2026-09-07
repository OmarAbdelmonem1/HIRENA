package com.hirena.jobseeker.dto;

import com.hirena.jobseeker.entity.JobSeeker;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobSeekerRequest {

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    private String phone;

    private LocalDate dateOfBirth;

    private JobSeeker.Gender gender;

    private String address;

    private String city;

    private String country;

    private String bio;

    private String currentJobTitle;

    @PositiveOrZero(message = "Years of experience must be zero or positive")
    private Integer yearsOfExperience;

    @PositiveOrZero(message = "Expected salary must be zero or positive")
    private Double expectedSalary;

    private JobSeeker.Availability availability;

    @Valid
    private List<EducationRequest> education;

    @Valid
    private List<WorkExperienceRequest> workExperience;

    @Valid
    private List<CertificateRequest> certificates;

    private List<String> skills;
}
