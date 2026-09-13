package com.hirena.company.repository;

import com.hirena.company.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.EntityGraph;

import java.util.Optional;

public interface CompanyRepository extends JpaRepository<Company, Long>, JpaSpecificationExecutor<Company> {

    @EntityGraph(attributePaths = "user")
    Optional<Company> findByUserId(Long userId);

    @EntityGraph(attributePaths = "user")
    Optional<Company> findById(Long id);

    boolean existsByUserId(Long userId);
}
