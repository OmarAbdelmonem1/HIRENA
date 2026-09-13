package com.hirena.job.controller;

import com.hirena.job.dto.AdminJobRejectionRequest;
import com.hirena.job.dto.JobResponse;
import com.hirena.job.dto.AdminJobListResponse;
import com.hirena.job.dto.AdminJobDetailsResponse;
import com.hirena.job.dto.JobRequest;
import com.hirena.job.entity.*;
import jakarta.validation.Valid;
import org.springframework.data.domain.*;
import org.springframework.data.web.PageableDefault;
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

    @GetMapping
    public ResponseEntity<Page<AdminJobListResponse>> getJobs(@RequestParam(required=false) String search, @RequestParam(required=false) JobStatus status, @RequestParam(required=false) String company, @RequestParam(required=false) String location, @RequestParam(required=false) EmploymentType employmentType, @RequestParam(required=false) Integer experienceRequired, @PageableDefault(size=10, sort="createdAt", direction=Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(jobService.getAdminJobs(pageable));
    }
    @GetMapping("/{id}") public ResponseEntity<AdminJobDetailsResponse> getJob(@PathVariable Long id) { return ResponseEntity.ok(jobService.getAdminJob(id)); }
    @PutMapping("/{id}") public ResponseEntity<JobResponse> updateJob(@PathVariable Long id, @Valid @RequestBody JobRequest request) { return ResponseEntity.ok(jobService.updateAdminJob(id, request)); }
    @DeleteMapping("/{id}") public ResponseEntity<Void> deleteJob(@PathVariable Long id) { jobService.deleteAdminJob(id); return ResponseEntity.noContent().build(); }

    @GetMapping("/pending")
    public ResponseEntity<List<JobResponse>> getPendingJobs() {
        return ResponseEntity.ok(jobService.getPendingJobs());
    }

    @RequestMapping(value = "/{id}/approve", method = {RequestMethod.PUT, RequestMethod.PATCH})
    public ResponseEntity<JobResponse> approveJob(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.approveJob(id));
    }

    @RequestMapping(value = "/{id}/reject", method = {RequestMethod.PUT, RequestMethod.PATCH})
    public ResponseEntity<JobResponse> rejectJob(@PathVariable Long id,
                                                   @RequestBody(required = false) AdminJobRejectionRequest request) {
        return ResponseEntity.ok(jobService.rejectJob(id, request));
    }
}
