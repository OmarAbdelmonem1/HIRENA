package com.hirena.application.repository;

import com.hirena.application.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;

import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    // JobSeeker: own applications
    List<Application> findAllByJobSeekerId(Long jobSeekerId);

    Optional<Application> findByIdAndJobSeekerId(Long id, Long jobSeekerId);

    // Duplicate check
    boolean existsByJobIdAndJobSeekerId(Long jobId, Long jobSeekerId);

    // Company: applications for a specific job
    List<Application> findAllByJobId(Long jobId);

    Optional<Application> findByIdAndJobId(Long applicationId, Long jobId);

    @EntityGraph(attributePaths = {"job", "job.company", "jobSeeker", "jobSeeker.user"})
    List<Application> findAllByJobCompanyId(Long companyId);

    @EntityGraph(attributePaths = {"job", "job.company", "jobSeeker", "jobSeeker.user"})
    Optional<Application> findByIdAndJobCompanyId(Long applicationId, Long companyId);

    // Analytics
    long countByJobId(Long jobId);
    void deleteByJobId(Long jobId);

    // Admin statistics
    long count();
}
