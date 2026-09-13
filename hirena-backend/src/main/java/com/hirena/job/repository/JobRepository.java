package com.hirena.job.repository;

import com.hirena.job.entity.Job;
import com.hirena.job.entity.JobStatus;
import com.hirena.job.entity.EmploymentType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    // Company's own jobs (all statuses)
    List<Job> findAllByCompanyId(Long companyId);

    Optional<Job> findByIdAndCompanyId(Long id, Long companyId);

    // Public approved jobs
    Page<Job> findAllByStatus(JobStatus status, Pageable pageable);

    // Admin: pending jobs
    List<Job> findAllByStatus(JobStatus status);

Page<Job> findAll(Pageable pageable);
    // Counts for admin statistics
    long countByStatus(JobStatus status);
}
