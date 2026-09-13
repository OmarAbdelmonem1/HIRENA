package com.hirena.cv.analysis.controller;

import com.hirena.cv.analysis.dto.CvScoreResponse;
import com.hirena.cv.analysis.service.CvAnalysisService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/cv")
@RequiredArgsConstructor
public class CvAnalysisController {
    private final CvAnalysisService cvAnalysisService;

    @PostMapping(value = "/analyze", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CvScoreResponse> analyze(
            @RequestPart("cv") MultipartFile cv,
            @RequestPart("jobDescription") String jobDescription) {
        return ResponseEntity.ok(cvAnalysisService.analyze(cv, jobDescription));
    }
}
