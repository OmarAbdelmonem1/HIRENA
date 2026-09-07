package com.hirena.jobseeker.controller;

import com.hirena.jobseeker.dto.JobSeekerRequest;
import com.hirena.jobseeker.dto.JobSeekerResponse;
import com.hirena.jobseeker.service.JobSeekerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/jobseeker")
@RequiredArgsConstructor
public class JobSeekerController {

    private final JobSeekerService jobSeekerService;

    // ── Profile ───────────────────────────────────────────────────────────

    @GetMapping("/profile")
    public ResponseEntity<JobSeekerResponse> getMyProfile() {
        return ResponseEntity.ok(jobSeekerService.getMyProfile());
    }

    @PostMapping("/profile")
    public ResponseEntity<JobSeekerResponse> createMyProfile(
            @Valid @RequestBody JobSeekerRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(jobSeekerService.createMyProfile(request));
    }

    @PutMapping("/profile")
    public ResponseEntity<JobSeekerResponse> updateMyProfile(
            @Valid @RequestBody JobSeekerRequest request) {
        return ResponseEntity.ok(jobSeekerService.updateMyProfile(request));
    }

    @DeleteMapping("/profile")
    public ResponseEntity<Void> deleteMyProfile() {
        jobSeekerService.deleteMyProfile();
        return ResponseEntity.noContent().build();
    }

    // ── Profile image ─────────────────────────────────────────────────────

    @PostMapping(value = "/profile/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<JobSeekerResponse> uploadProfileImage(
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(jobSeekerService.uploadProfileImage(file));
    }

    @DeleteMapping("/profile/image")
    public ResponseEntity<Void> deleteProfileImage() {
        jobSeekerService.deleteProfileImage();
        return ResponseEntity.noContent().build();
    }
}
