package com.hirena.job.repository;

import com.hirena.job.entity.Job;
import com.hirena.job.entity.JobStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface JobRepository extends JpaRepository<Job, Long>, JpaSpecificationExecutor<Job> {

    // Company's own jobs (all statuses)
    List<Job> findAllByCompanyId(Long companyId);

    Optional<Job> findByIdAndCompanyId(Long id, Long companyId);

    // Public approved jobs
    Page<Job> findAllByStatus(JobStatus status, Pageable pageable);

    Page<Job> findAllByCompanyIdAndStatus(Long companyId, JobStatus status, Pageable pageable);

    // Admin: pending jobs
    List<Job> findAllByStatus(JobStatus status);

Page<Job> findAll(Pageable pageable);
    // Counts for admin statistics
    long countByStatus(JobStatus status);
}
