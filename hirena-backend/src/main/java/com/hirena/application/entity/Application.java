package com.hirena.application.entity;

import com.hirena.job.entity.Job;
import com.hirena.jobseeker.entity.JobSeeker;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(
    name = "applications",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uq_application_job_jobseeker",
            columnNames = {"job_id", "job_seeker_id"}
        )
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_seeker_id", nullable = false)
    private JobSeeker jobSeeker;

    @Column(name = "cover_letter", columnDefinition = "TEXT")
    private String coverLetter;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ApplicationStatus status = ApplicationStatus.PENDING;

    @CreationTimestamp
    @Column(name = "applied_at", updatable = false)
    private LocalDateTime appliedAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "company_viewed_at")
    private LocalDateTime companyViewedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "cv_analysis_status", nullable = false)
    @Builder.Default
    private CvAnalysisStatus cvAnalysisStatus = CvAnalysisStatus.NOT_ANALYZED;

    @Column(name = "cv_score")
    private Integer cvScore;

    @Column(name = "cv_experience_match")
    private Integer cvExperienceMatch;

    @Column(name = "cv_matched_skills", columnDefinition = "TEXT")
    private String cvMatchedSkills;

    @Column(name = "cv_missing_skills", columnDefinition = "TEXT")
    private String cvMissingSkills;

    @Column(name = "cv_matched_responsibilities", columnDefinition = "TEXT")
    private String cvMatchedResponsibilities;

    @Column(name = "cv_missing_responsibilities", columnDefinition = "TEXT")
    private String cvMissingResponsibilities;

    @Column(name = "cv_recommendations", columnDefinition = "TEXT")
    private String cvRecommendations;

    @Column(name = "cv_analysis_summary", columnDefinition = "TEXT")
    private String cvAnalysisSummary;

    @Column(name = "cv_analysis_error", columnDefinition = "TEXT")
    private String cvAnalysisError;

    @Column(name = "cv_analyzed_at")
    private LocalDateTime cvAnalyzedAt;
}
