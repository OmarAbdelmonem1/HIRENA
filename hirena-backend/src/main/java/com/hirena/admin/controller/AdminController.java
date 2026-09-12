package com.hirena.admin.controller;

import com.hirena.admin.dto.AdminDashboardResponse;
import com.hirena.admin.service.AdminDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminDashboardService dashboardService;

    @GetMapping("/dashboard")
    @Transactional(readOnly = true)
    public ResponseEntity<AdminDashboardResponse> getDashboard() {
        AdminDashboardResponse response = dashboardService.getDashboard();
        return ResponseEntity.ok(response);
    }
}
