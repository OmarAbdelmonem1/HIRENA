package com.hirena.company.controller;

import com.hirena.company.dto.CompanyRequest;
import com.hirena.company.dto.CompanyResponse;
import com.hirena.company.service.CompanyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/company")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;

    @PostMapping
    public ResponseEntity<CompanyResponse> createProfile(@Valid @RequestBody CompanyRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(companyService.createProfile(request));
    }
    @GetMapping("/{id}")
    public ResponseEntity<CompanyResponse> getCompanyById(@PathVariable Long id) {
        return ResponseEntity.ok(companyService.getCompanyById(id));
    }

    @GetMapping
    public ResponseEntity<CompanyResponse> getProfile() {
        return ResponseEntity.ok(companyService.getMyProfile());
    }

    @PutMapping
    public ResponseEntity<CompanyResponse> updateProfile(@Valid @RequestBody CompanyRequest request) {
        return ResponseEntity.ok(companyService.updateProfile(request));
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteProfile() {
        companyService.deleteProfile();
        return ResponseEntity.noContent().build();
    }

}
