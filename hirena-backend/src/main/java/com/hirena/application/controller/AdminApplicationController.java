package com.hirena.application.controller;

import com.hirena.application.dto.ApplicationResponse;
import com.hirena.application.service.ApplicationService;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/admin/applications")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminApplicationController {

    private final ApplicationService applicationService;

    @GetMapping
    public ResponseEntity<Page<ApplicationResponse>> getAllApplications(
            @PageableDefault(
                    size = 10,
                    sort = "appliedAt",
                    direction = Sort.Direction.DESC
            ) Pageable pageable) {

        return ResponseEntity.ok(
                applicationService.getAllApplications(pageable)
        );
    }
@GetMapping("/{id}")
public ResponseEntity<ApplicationResponse> getApplicationById(
        @PathVariable Long id) {

    return ResponseEntity.ok(
            applicationService.getApplicationById(id)
    );
}
    

}