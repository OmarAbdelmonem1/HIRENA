package com.hirena.jobseeker.controller;

import com.hirena.jobseeker.dto.AdminJobSeekerListResponse;
import com.hirena.jobseeker.dto.JobSeekerResponse;
import com.hirena.jobseeker.service.JobSeekerService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Admin-only job seeker management. Mounted under /api/admin/** which is
 * already restricted to ROLE_ADMIN in SecurityConfig; the class-level
 * {@link PreAuthorize} is kept for defense in depth.
 */
@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminJobSeekerController {

    private final JobSeekerService jobSeekerService;

    /** Lightweight, paginated list for the admin Users table. */
    @GetMapping
    public ResponseEntity<Page<AdminJobSeekerListResponse>> getAllJobSeekers(
            @PageableDefault(size = 10, sort = "createdAt") Pageable pageable) {
        return ResponseEntity.ok(jobSeekerService.getAllJobSeekers(pageable));
    }

    /** Full profile for the admin user-details view. */
    @GetMapping("/{id}")
    public ResponseEntity<JobSeekerResponse> getJobSeekerById(@PathVariable Long id) {
        return ResponseEntity.ok(jobSeekerService.getJobSeekerById(id));
    }
}
