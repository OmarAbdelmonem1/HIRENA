package com.hirena.jobseeker.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "cvs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CV {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * UNIQUE enforced at column level: one CV row per JobSeeker.
     * The owning side lives here so JPA can enforce the constraint via DDL.
     */
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_seeker_id", nullable = false, unique = true)
    private JobSeeker jobSeeker;

    @Column(nullable = false)
    private String fileName;

    /** Relative filesystem path – never stored as BLOB. */
    @Column(nullable = false)
    private String filePath;

    @Column(nullable = false)
    private String fileType;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime uploadedAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
