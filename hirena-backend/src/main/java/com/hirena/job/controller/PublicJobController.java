package com.hirena.job.controller;

import com.hirena.job.dto.JobResponse;
import com.hirena.job.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class PublicJobController {

    private final JobService jobService;

    @GetMapping
    public ResponseEntity<Page<JobResponse>> getApprovedJobs(
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable) {
        return ResponseEntity.ok(jobService.getApprovedJobs(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobResponse> getJobById(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getApprovedJobById(id));
    }
}
