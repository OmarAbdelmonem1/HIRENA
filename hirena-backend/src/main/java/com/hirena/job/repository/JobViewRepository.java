package com.hirena.job.repository;

import com.hirena.job.entity.JobView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface JobViewRepository extends JpaRepository<JobView, Long> {

    // Check if this job seeker already viewed this job within the given window
    Optional<JobView> findTopByJobIdAndJobSeekerIdAndViewedAtAfter(
            Long jobId, Long jobSeekerId, LocalDateTime after);

    // Total views for a job
    long countByJobId(Long jobId);

    // Unique viewers for a job
    @Query("SELECT COUNT(DISTINCT jv.jobSeeker.id) FROM JobView jv WHERE jv.job.id = :jobId")
    long countDistinctJobSeekerByJobId(@Param("jobId") Long jobId);
}
