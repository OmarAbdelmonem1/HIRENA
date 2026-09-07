package com.hirena.jobseeker.repository;

import com.hirena.jobseeker.entity.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CertificateRepository extends JpaRepository<Certificate, Long> {

    List<Certificate> findByJobSeekerId(Long jobSeekerId);

    Optional<Certificate> findByIdAndJobSeekerId(Long id, Long jobSeekerId);
}
