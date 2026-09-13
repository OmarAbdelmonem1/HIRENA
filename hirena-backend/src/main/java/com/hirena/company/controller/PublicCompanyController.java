package com.hirena.company.controller;

import com.hirena.company.dto.CompanyResponse;
import com.hirena.company.service.CompanyService;
import com.hirena.company.dto.PublicCompanyDetailsResponse;
import com.hirena.job.entity.JobStatus;
import com.hirena.job.repository.JobRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/public/companies")
@RequiredArgsConstructor
public class PublicCompanyController {

    private final CompanyService companyService;
    private final JobRepository jobRepository;

    @GetMapping
    public ResponseEntity<org.springframework.data.domain.Page<CompanyResponse>> getCompanies(
            @org.springframework.web.bind.annotation.RequestParam(required = false) String keyword,
            @org.springframework.web.bind.annotation.RequestParam(required = false) String industry,
            @org.springframework.web.bind.annotation.RequestParam(defaultValue = "0") int page,
            @org.springframework.web.bind.annotation.RequestParam(defaultValue = "12") int size) {
        return ResponseEntity.ok(companyService.getPublicCompanies(keyword, industry,
                PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 50),
                        Sort.by(Sort.Direction.ASC, "companyName"))));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PublicCompanyDetailsResponse> getCompany(
            @org.springframework.web.bind.annotation.PathVariable Long id,
            @org.springframework.web.bind.annotation.RequestParam(defaultValue = "0") int page,
            @org.springframework.web.bind.annotation.RequestParam(defaultValue = "6") int size) {
        var company = companyService.getPublicCompany(id);
        var jobs = jobRepository.findAllByCompanyIdAndStatus(id, JobStatus.APPROVED,
                PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 50),
                        Sort.by(Sort.Direction.DESC, "createdAt")))
                .map(com.hirena.job.dto.JobResponse::fromEntity);
        return ResponseEntity.ok(PublicCompanyDetailsResponse.builder().company(company).jobs(jobs).build());
    }
}
