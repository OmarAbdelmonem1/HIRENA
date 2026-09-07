package com.hirena.jobseeker.repository;

import com.hirena.jobseeker.entity.Education;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EducationRepository extends JpaRepository<Education, Long> {

    List<Education> findByJobSeekerId(Long jobSeekerId);

    Optional<Education> findByIdAndJobSeekerId(Long id, Long jobSeekerId);
}
