package com.hirena.application.controller;

import com.hirena.application.dto.ApplicationResponse;
import com.hirena.application.dto.ApplicationStatusUpdateRequest;
import com.hirena.application.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/company/jobs/{jobId}/applications")
@RequiredArgsConstructor
@PreAuthorize("hasRole('COMPANY')")
public class CompanyApplicationController {

    private final ApplicationService applicationService;

    @GetMapping
    public ResponseEntity<List<ApplicationResponse>> getApplications(@PathVariable Long jobId) {
        return ResponseEntity.ok(applicationService.getApplicationsForJob(jobId));
    }

    @GetMapping("/{applicationId}")
    public ResponseEntity<ApplicationResponse> getApplication(@PathVariable Long jobId,
                                                               @PathVariable Long applicationId) {
        return ResponseEntity.ok(applicationService.getApplicationForJob(jobId, applicationId));
    }

    @PutMapping("/{applicationId}/status")
    public ResponseEntity<ApplicationResponse> updateStatus(@PathVariable Long jobId,
                                                             @PathVariable Long applicationId,
                                                             @Valid @RequestBody ApplicationStatusUpdateRequest request) {
        return ResponseEntity.ok(applicationService.updateApplicationStatus(jobId, applicationId, request));
    }
}
