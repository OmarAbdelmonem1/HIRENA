package com.hirena.jobseeker.entity;

import com.hirena.user.entity.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "job_seekers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobSeeker {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** UNIQUE constraint enforces one JobSeeker per User. */
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @NotBlank
    @Column(nullable = false)
    private String firstName;

    @NotBlank
    @Column(nullable = false)
    private String lastName;

    private String phone;

    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    private String address;

    private String city;

    private String country;

    /** Relative filesystem path – NOT a BLOB. */
    private String profileImage;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private String currentJobTitle;

    @PositiveOrZero
    private Integer yearsOfExperience;

    @PositiveOrZero
    private Double expectedSalary;

    @Enumerated(EnumType.STRING)
    private Availability availability;

    // ── Relationships (all LAZY, cascade-delete owned children) ──────────

    @OneToMany(mappedBy = "jobSeeker", cascade = CascadeType.ALL,
               orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Education> educationList = new ArrayList<>();

    @OneToMany(mappedBy = "jobSeeker", cascade = CascadeType.ALL,
               orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<WorkExperience> workExperienceList = new ArrayList<>();

    @OneToMany(mappedBy = "jobSeeker", cascade = CascadeType.ALL,
               orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Certificate> certificateList = new ArrayList<>();

    /**
     * N:N with Skill via join table job_seeker_skills.
     * Skills themselves are shared lookup rows, so we do NOT cascade delete
     * the Skill row when a JobSeeker removes it from their set.
     */
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "job_seeker_skills",
        joinColumns = @JoinColumn(name = "job_seeker_id"),
        inverseJoinColumns = @JoinColumn(name = "skill_id")
    )
    @Builder.Default
    private Set<Skill> skills = new HashSet<>();

    /** 1:1 – CV is cascade-deleted when JobSeeker is deleted. */
    @OneToOne(mappedBy = "jobSeeker", cascade = CascadeType.ALL,
              orphanRemoval = true, fetch = FetchType.LAZY)
    private CV cv;

    // ── Timestamps ────────────────────────────────────────────────────────

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    // ── Enums ─────────────────────────────────────────────────────────────

    public enum Gender {
        MALE, FEMALE, OTHER, PREFER_NOT_TO_SAY
    }

    public enum Availability {
        IMMEDIATE, TWO_WEEKS, ONE_MONTH, NEGOTIABLE
    }
}
