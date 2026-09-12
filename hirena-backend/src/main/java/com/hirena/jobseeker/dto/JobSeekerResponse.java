package com.hirena.jobseeker.dto;

import com.hirena.jobseeker.entity.JobSeeker;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobSeekerResponse {

    private Long id;
    private String email; // from linked User, read-only, never password
    private String firstName;
    private String lastName;
    private String phone;
    private LocalDate dateOfBirth;
    private JobSeeker.Gender gender;
    private String address;
    private String city;
    private String country;
    private String profileImage;
    private String bio;
    private String currentJobTitle;
    private Integer yearsOfExperience;
    private Double expectedSalary;
    private JobSeeker.Availability availability;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean enabled; // account status, from linked User

    private List<EducationResponse> education;
    private List<WorkExperienceResponse> workExperience;
    private List<CertificateResponse> certificates;
    private List<SkillResponse> skills;
    private CVResponse cv;

    public static JobSeekerResponse fromEntity(JobSeeker jobSeeker) {
        return JobSeekerResponse.builder()
                .id(jobSeeker.getId())
                .email(jobSeeker.getUser() != null ? jobSeeker.getUser().getEmail() : null)
                .firstName(jobSeeker.getFirstName())
                .lastName(jobSeeker.getLastName())
                .phone(jobSeeker.getPhone())
                .dateOfBirth(jobSeeker.getDateOfBirth())
                .gender(jobSeeker.getGender())
                .address(jobSeeker.getAddress())
                .city(jobSeeker.getCity())
                .country(jobSeeker.getCountry())
                .profileImage(jobSeeker.getProfileImage())
                .bio(jobSeeker.getBio())
                .currentJobTitle(jobSeeker.getCurrentJobTitle())
                .yearsOfExperience(jobSeeker.getYearsOfExperience())
                .expectedSalary(jobSeeker.getExpectedSalary())
                .availability(jobSeeker.getAvailability())
                .createdAt(jobSeeker.getCreatedAt())
                .updatedAt(jobSeeker.getUpdatedAt())
                .enabled(jobSeeker.getUser() == null || jobSeeker.getUser().isEnabled())
                .education(jobSeeker.getEducationList() != null ?
                        jobSeeker.getEducationList().stream().map(EducationResponse::fromEntity).toList() : null)
                .workExperience(jobSeeker.getWorkExperienceList() != null ?
                        jobSeeker.getWorkExperienceList().stream().map(WorkExperienceResponse::fromEntity).toList() : null)
                .certificates(jobSeeker.getCertificateList() != null ?
                        jobSeeker.getCertificateList().stream().map(CertificateResponse::fromEntity).toList() : null)
                .skills(jobSeeker.getSkills() != null ?
                        jobSeeker.getSkills().stream().map(SkillResponse::fromEntity).toList() : null)
                .cv(jobSeeker.getCv() != null ? CVResponse.fromEntity(jobSeeker.getCv()) : null)
                .build();
    }
}
