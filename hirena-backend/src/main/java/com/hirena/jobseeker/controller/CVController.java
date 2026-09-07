package com.hirena.jobseeker.controller;

import com.hirena.jobseeker.dto.CVResponse;
import com.hirena.jobseeker.service.CVService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/jobseeker/cv")
@RequiredArgsConstructor
public class CVController {

    private final CVService cvService;

    @GetMapping
    public ResponseEntity<CVResponse> getMyCv() {
        return ResponseEntity.ok(cvService.getMyCv());
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CVResponse> uploadCv(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.status(HttpStatus.CREATED).body(cvService.uploadCv(file));
    }

    @PutMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CVResponse> replaceCv(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(cvService.replaceCv(file));
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteCv() {
        cvService.deleteCv();
        return ResponseEntity.noContent().build();
    }
}
