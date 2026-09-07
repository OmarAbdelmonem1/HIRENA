package com.hirena.jobseeker.controller;

import com.hirena.jobseeker.dto.WorkExperienceRequest;
import com.hirena.jobseeker.dto.WorkExperienceResponse;
import com.hirena.jobseeker.service.WorkExperienceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobseeker/experience")
@RequiredArgsConstructor
public class WorkExperienceController {

    private final WorkExperienceService workExperienceService;

    @GetMapping
    public ResponseEntity<List<WorkExperienceResponse>> getMyExperience() {
        return ResponseEntity.ok(workExperienceService.getMyExperience());
    }

    @PostMapping
    public ResponseEntity<WorkExperienceResponse> addExperience(@Valid @RequestBody WorkExperienceRequest request) {
        WorkExperienceResponse response = workExperienceService.addExperience(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<WorkExperienceResponse> updateExperience(
            @PathVariable Long id, @Valid @RequestBody WorkExperienceRequest request) {
        return ResponseEntity.ok(workExperienceService.updateExperience(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExperience(@PathVariable Long id) {
        workExperienceService.deleteExperience(id);
        return ResponseEntity.noContent().build();
    }
}
