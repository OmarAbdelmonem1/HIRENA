package com.hirena.job.controller;

import com.hirena.job.dto.AdminJobRejectionRequest;
import com.hirena.job.dto.JobResponse;
import com.hirena.job.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/jobs")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminJobController {

    private final JobService jobService;

    @GetMapping("/pending")
    public ResponseEntity<List<JobResponse>> getPendingJobs() {
        return ResponseEntity.ok(jobService.getPendingJobs());
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<JobResponse> approveJob(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.approveJob(id));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<JobResponse> rejectJob(@PathVariable Long id,
                                                   @RequestBody(required = false) AdminJobRejectionRequest request) {
        return ResponseEntity.ok(jobService.rejectJob(id, request));
    }
}
