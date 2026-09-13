package com.hirena.application.repository;

import com.hirena.application.entity.Application;
import com.hirena.application.entity.ApplicationStatus;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    // JobSeeker: own applications
    List<Application> findAllByJobSeekerId(Long jobSeekerId);

    Optional<Application> findByIdAndJobSeekerId(Long id, Long jobSeekerId);

    // Duplicate check
    boolean existsByJobIdAndJobSeekerId(Long jobId, Long jobSeekerId);

    // Company: applications for a specific job
    List<Application> findAllByJobId(Long jobId);

    Optional<Application> findByIdAndJobId(Long applicationId, Long jobId);

    List<Application> findAllByJobCompanyId(Long companyId);

    Optional<Application> findByIdAndJobCompanyId(Long applicationId, Long companyId);

    // Analytics
    long countByJobId(Long jobId);
    void deleteByJobId(Long jobId);

    // Admin statistics
    long count();
}
