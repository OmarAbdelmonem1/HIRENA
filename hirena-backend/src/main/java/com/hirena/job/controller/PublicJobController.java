package com.hirena.job.controller;

import com.hirena.job.dto.JobResponse;
import com.hirena.job.service.JobService;
import com.hirena.job.entity.EmploymentType;
import com.hirena.job.entity.JobCategory;
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
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) EmploymentType employmentType,
            @RequestParam(required = false) JobCategory category,
            @RequestParam(required = false) Integer minExperience,
            @PageableDefault(size = 12, sort = "createdAt") Pageable pageable) {
        return ResponseEntity.ok(jobService.getApprovedJobs(
                pageable, keyword, location, employmentType, category, minExperience));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobResponse> getJobById(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getApprovedJobById(id));
    }
}
