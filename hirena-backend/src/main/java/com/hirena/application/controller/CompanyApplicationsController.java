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
import com.hirena.jobseeker.entity.CV;
import com.hirena.jobseeker.util.FileStorageService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

@RestController
@RequestMapping("/api/company/applications")
@RequiredArgsConstructor
@PreAuthorize("hasRole('COMPANY')")
public class CompanyApplicationsController {

    private final ApplicationService applicationService;
    private final FileStorageService fileStorageService;

    @GetMapping
    public ResponseEntity<List<ApplicationResponse>> getCompanyApplications() {
        return ResponseEntity.ok(applicationService.getApplicationsForCurrentCompany());
    }

    @GetMapping("/{applicationId}")
    public ResponseEntity<ApplicationResponse> getCompanyApplication(@PathVariable Long applicationId) {
        return ResponseEntity.ok(applicationService.getCompanyApplication(applicationId));
    }

    @GetMapping("/{applicationId}/cv")
    public ResponseEntity<byte[]> getApplicationCv(@PathVariable Long applicationId) {
        CV cv = applicationService.getCompanyApplicationCv(applicationId);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(cv.getFileType()))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + cv.getFileName().replace("\"", "") + "\"")
                .body(fileStorageService.readFile(cv.getFilePath()));
    }

    @PutMapping("/{applicationId}/status")
    public ResponseEntity<ApplicationResponse> updateCompanyApplicationStatus(
            @PathVariable Long applicationId,
            @Valid @RequestBody ApplicationStatusUpdateRequest request) {
        return ResponseEntity.ok(applicationService.updateCompanyApplicationStatus(applicationId, request));
    }
}
