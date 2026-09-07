package com.hirena.job.controller;

import com.hirena.application.repository.ApplicationRepository;
import com.hirena.company.repository.CompanyRepository;
import com.hirena.job.dto.AdminStatisticsResponse;
import com.hirena.job.entity.JobStatus;
import com.hirena.job.repository.JobRepository;
import com.hirena.jobseeker.repository.JobSeekerRepository;
import com.hirena.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminStatisticsController {

    private final UserRepository userRepository;
    private final JobSeekerRepository jobSeekerRepository;
    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;

    @GetMapping("/statistics")
    @Transactional(readOnly = true)
    public ResponseEntity<AdminStatisticsResponse> getStatistics() {
        AdminStatisticsResponse stats = AdminStatisticsResponse.builder()
                .totalUsers(userRepository.count())
                .totalJobSeekers(jobSeekerRepository.count())
                .totalCompanies(companyRepository.count())
                .totalJobs(jobRepository.count())
                .pendingJobs(jobRepository.countByStatus(JobStatus.PENDING))
                .approvedJobs(jobRepository.countByStatus(JobStatus.APPROVED))
                .rejectedJobs(jobRepository.countByStatus(JobStatus.REJECTED))
                .totalApplications(applicationRepository.count())
                .build();

        return ResponseEntity.ok(stats);
    }
}
