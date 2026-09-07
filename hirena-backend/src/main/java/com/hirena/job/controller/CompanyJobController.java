package com.hirena.job.controller;

import com.hirena.job.dto.JobAnalyticsResponse;
import com.hirena.job.dto.JobRequest;
import com.hirena.job.dto.JobResponse;
import com.hirena.job.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/company/jobs")
@RequiredArgsConstructor
@PreAuthorize("hasRole('COMPANY')")
public class CompanyJobController {

    private final JobService jobService;

    @PostMapping
    public ResponseEntity<JobResponse> createJob(@Valid @RequestBody JobRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(jobService.createJob(request));
    }

    @GetMapping
    public ResponseEntity<List<JobResponse>> getMyJobs() {
        return ResponseEntity.ok(jobService.getMyCompanyJobs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobResponse> getMyJob(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getMyCompanyJob(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobResponse> updateJob(@PathVariable Long id,
                                                  @Valid @RequestBody JobRequest request) {
        return ResponseEntity.ok(jobService.updateJob(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{jobId}/analytics")
    public ResponseEntity<JobAnalyticsResponse> getAnalytics(@PathVariable Long jobId) {
        return ResponseEntity.ok(jobService.getJobAnalytics(jobId));
    }
}
