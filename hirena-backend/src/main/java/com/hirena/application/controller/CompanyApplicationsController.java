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
@RequestMapping("/api/company/applications")
@RequiredArgsConstructor
@PreAuthorize("hasRole('COMPANY')")
public class CompanyApplicationsController {

    private final ApplicationService applicationService;

    @GetMapping
    public ResponseEntity<List<ApplicationResponse>> getCompanyApplications() {
        return ResponseEntity.ok(applicationService.getApplicationsForCurrentCompany());
    }

    @GetMapping("/{applicationId}")
    public ResponseEntity<ApplicationResponse> getCompanyApplication(@PathVariable Long applicationId) {
        return ResponseEntity.ok(applicationService.getCompanyApplication(applicationId));
    }

    @PutMapping("/{applicationId}/status")
    public ResponseEntity<ApplicationResponse> updateCompanyApplicationStatus(
            @PathVariable Long applicationId,
            @Valid @RequestBody ApplicationStatusUpdateRequest request) {
        return ResponseEntity.ok(applicationService.updateCompanyApplicationStatus(applicationId, request));
    }
}
