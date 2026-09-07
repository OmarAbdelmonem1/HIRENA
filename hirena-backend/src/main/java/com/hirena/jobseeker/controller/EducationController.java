package com.hirena.jobseeker.controller;

import com.hirena.jobseeker.dto.EducationRequest;
import com.hirena.jobseeker.dto.EducationResponse;
import com.hirena.jobseeker.service.EducationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobseeker/education")
@RequiredArgsConstructor
public class EducationController {

    private final EducationService educationService;

    @GetMapping
    public ResponseEntity<List<EducationResponse>> getMyEducation() {
        return ResponseEntity.ok(educationService.getMyEducation());
    }

    @PostMapping
    public ResponseEntity<EducationResponse> addEducation(@Valid @RequestBody EducationRequest request) {
        EducationResponse response = educationService.addEducation(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EducationResponse> updateEducation(
            @PathVariable Long id, @Valid @RequestBody EducationRequest request) {
        return ResponseEntity.ok(educationService.updateEducation(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEducation(@PathVariable Long id) {
        educationService.deleteEducation(id);
        return ResponseEntity.noContent().build();
    }
}
