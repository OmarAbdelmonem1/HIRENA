package com.hirena.application.dto;

import com.hirena.application.entity.Application;
import com.hirena.application.entity.ApplicationStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ApplicationResponse {

    private Long id;

    // Job summary
    private Long jobId;
    private String jobTitle;
    private String companyName;

    // JobSeeker summary
    private Long jobSeekerId;
    private String jobSeekerFirstName;
    private String jobSeekerLastName;
    private String jobSeekerEmail;
    private String jobSeekerPhone;
    private String jobSeekerCity;
    private String jobSeekerCountry;
    private String jobSeekerProfileImage;
    private String jobSeekerBio;
    private String jobSeekerTargetJobTitle;
    private Integer jobSeekerYearsOfExperience;
    private String jobSeekerCvFileName;

    private String coverLetter;
    private ApplicationStatus status;
    private LocalDateTime appliedAt;
    private LocalDateTime updatedAt;

    public static ApplicationResponse fromEntity(Application application) {
        return ApplicationResponse.builder()
                .id(application.getId())
                .jobId(application.getJob().getId())
                .jobTitle(application.getJob().getTitle())
                .companyName(application.getJob().getCompany().getCompanyName())
                .jobSeekerId(application.getJobSeeker().getId())
                .jobSeekerFirstName(application.getJobSeeker().getFirstName())
                .jobSeekerLastName(application.getJobSeeker().getLastName())
                .jobSeekerEmail(application.getJobSeeker().getUser() != null
                        ? application.getJobSeeker().getUser().getEmail()
                        : null)
                .jobSeekerPhone(application.getJobSeeker().getPhone())
                .jobSeekerCity(application.getJobSeeker().getCity())
                .jobSeekerCountry(application.getJobSeeker().getCountry())
                .jobSeekerProfileImage(application.getJobSeeker().getProfileImage())
                .jobSeekerBio(application.getJobSeeker().getBio())
                .jobSeekerTargetJobTitle(application.getJobSeeker().getCurrentJobTitle())
                .jobSeekerYearsOfExperience(application.getJobSeeker().getYearsOfExperience())
                .jobSeekerCvFileName(application.getJobSeeker().getCv() != null
                        ? application.getJobSeeker().getCv().getFileName() : null)
                .coverLetter(application.getCoverLetter())
                .status(application.getStatus())
                .appliedAt(application.getAppliedAt())
                .updatedAt(application.getUpdatedAt())
                .build();
    }
}
