package com.hirena.company.controller;

import com.hirena.company.dto.AdminCompanyRequest;
import com.hirena.company.dto.CompanyResponse;
import com.hirena.company.service.AdminCompanyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/companies")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminCompanyController {

    private final AdminCompanyService adminCompanyService;

    @GetMapping
    public ResponseEntity<Page<CompanyResponse>> getAllCompanies(
            @PageableDefault(size = 10, sort = "createdAt") Pageable pageable) {
        return ResponseEntity.ok(adminCompanyService.getAllCompanies(pageable));
    }

    @PostMapping
    public ResponseEntity<CompanyResponse> createCompany(
            @Valid @RequestBody AdminCompanyRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(adminCompanyService.createCompany(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CompanyResponse> updateCompany(
            @PathVariable Long id,
            @Valid @RequestBody AdminCompanyRequest request) {
        return ResponseEntity.ok(adminCompanyService.updateCompany(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCompany(@PathVariable Long id) {
        adminCompanyService.deleteCompany(id);
        return ResponseEntity.noContent().build();
    }
}
