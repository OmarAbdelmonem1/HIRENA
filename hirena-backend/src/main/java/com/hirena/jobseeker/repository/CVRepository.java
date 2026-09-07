package com.hirena.jobseeker.repository;

import com.hirena.jobseeker.entity.CV;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CVRepository extends JpaRepository<CV, Long> {

    Optional<CV> findByJobSeekerId(Long jobSeekerId);

    boolean existsByJobSeekerId(Long jobSeekerId);
}
