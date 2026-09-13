package com.hirena.application.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "cv_analyses",
        uniqueConstraints = @UniqueConstraint(
                name = "uq_cv_analysis_application",
                columnNames = "application_id"
        )
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CvAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "application_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_cv_analysis_application")
    )
    private Application application;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private CvAnalysisStatus status = CvAnalysisStatus.NOT_ANALYZED;

    private Integer score;
    private Integer experienceMatch;

    @Column(columnDefinition = "TEXT")
    private String matchedSkills;

    @Column(columnDefinition = "TEXT")
    private String missingSkills;

    @Column(columnDefinition = "TEXT")
    private String matchedResponsibilities;

    @Column(columnDefinition = "TEXT")
    private String missingResponsibilities;

    @Column(columnDefinition = "TEXT")
    private String recommendations;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(columnDefinition = "TEXT")
    private String error;

    private LocalDateTime analyzedAt;
}
