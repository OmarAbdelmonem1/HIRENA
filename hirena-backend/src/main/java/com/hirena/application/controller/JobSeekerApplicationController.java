package com.hirena.application.controller;

import com.hirena.application.dto.ApplicationResponse;
import com.hirena.application.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobseeker/applications")
@RequiredArgsConstructor
@PreAuthorize("hasRole('JOB_SEEKER')")
public class JobSeekerApplicationController {

    private final ApplicationService applicationService;

    @GetMapping
    public ResponseEntity<List<ApplicationResponse>> getMyApplications() {
        return ResponseEntity.ok(applicationService.getMyApplications());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApplicationResponse> getMyApplication(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.getMyApplication(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> withdrawApplication(@PathVariable Long id) {
        applicationService.deleteMyApplication(id);
        return ResponseEntity.noContent().build();
    }
}
