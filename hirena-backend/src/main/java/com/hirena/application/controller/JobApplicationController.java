package com.hirena.application.controller;

import com.hirena.application.dto.ApplicationRequest;
import com.hirena.application.dto.ApplicationResponse;
import com.hirena.application.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobApplicationController {

    private final ApplicationService applicationService;

    @PostMapping("/{jobId}/apply")
    @PreAuthorize("hasRole('JOB_SEEKER')")
    public ResponseEntity<ApplicationResponse> apply(@PathVariable Long jobId,
                                                      @RequestBody(required = false) ApplicationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(applicationService.apply(jobId, request));
    }
}
