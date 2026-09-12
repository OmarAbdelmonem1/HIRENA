package com.hirena.jobseeker.dto;

import com.hirena.jobseeker.entity.JobSeeker;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Lightweight projection of {@link JobSeeker} for the admin "Users" list screen.
 * Deliberately excludes education/workExperience/certificates/skills/cv – those are
 * only needed on the single-user detail view ({@link JobSeekerResponse}).
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminJobSeekerListResponse {

    private Long id;
    private String firstName;
    private String lastName;
    private String email; // from linked User, never password
    private String phone;
    private String city;
    private String country;
    private String currentJobTitle;
    private Integer yearsOfExperience;
    private Double expectedSalary;
    private JobSeeker.Availability availability;
    private String profileImage;
    private boolean enabled; // account status, from linked User
    private LocalDateTime createdAt;

    public static AdminJobSeekerListResponse fromEntity(JobSeeker jobSeeker) {
        return AdminJobSeekerListResponse.builder()
                .id(jobSeeker.getId())
                .firstName(jobSeeker.getFirstName())
                .lastName(jobSeeker.getLastName())
                .email(jobSeeker.getUser() != null ? jobSeeker.getUser().getEmail() : null)
                .enabled(jobSeeker.getUser() == null || jobSeeker.getUser().isEnabled())
                .phone(jobSeeker.getPhone())
                .city(jobSeeker.getCity())
                .country(jobSeeker.getCountry())
                .currentJobTitle(jobSeeker.getCurrentJobTitle())
                .yearsOfExperience(jobSeeker.getYearsOfExperience())
                .expectedSalary(jobSeeker.getExpectedSalary())
                .availability(jobSeeker.getAvailability())
                .profileImage(jobSeeker.getProfileImage())
                .createdAt(jobSeeker.getCreatedAt())
                .build();
    }
}
