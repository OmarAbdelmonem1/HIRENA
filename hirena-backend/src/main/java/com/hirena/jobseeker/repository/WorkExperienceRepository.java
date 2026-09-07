package com.hirena.jobseeker.repository;

import com.hirena.jobseeker.entity.WorkExperience;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WorkExperienceRepository extends JpaRepository<WorkExperience, Long> {

    List<WorkExperience> findByJobSeekerId(Long jobSeekerId);

    Optional<WorkExperience> findByIdAndJobSeekerId(Long id, Long jobSeekerId);
}
