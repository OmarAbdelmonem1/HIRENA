package com.hirena.jobseeker.controller;

import com.hirena.jobseeker.dto.CertificateRequest;
import com.hirena.jobseeker.dto.CertificateResponse;
import com.hirena.jobseeker.service.CertificateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobseeker/certificates")
@RequiredArgsConstructor
public class CertificateController {

    private final CertificateService certificateService;

    @GetMapping
    public ResponseEntity<List<CertificateResponse>> getMyCertificates() {
        return ResponseEntity.ok(certificateService.getMyCertificates());
    }

    @PostMapping
    public ResponseEntity<CertificateResponse> addCertificate(
            @Valid @RequestBody CertificateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(certificateService.addCertificate(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CertificateResponse> updateCertificate(
            @PathVariable Long id,
            @Valid @RequestBody CertificateRequest request) {
        return ResponseEntity.ok(certificateService.updateCertificate(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCertificate(@PathVariable Long id) {
        certificateService.deleteCertificate(id);
        return ResponseEntity.noContent().build();
    }
}
