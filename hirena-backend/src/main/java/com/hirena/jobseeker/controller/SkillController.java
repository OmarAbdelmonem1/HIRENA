package com.hirena.jobseeker.controller;

import com.hirena.jobseeker.dto.SkillRequest;
import com.hirena.jobseeker.dto.SkillResponse;
import com.hirena.jobseeker.service.SkillService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobseeker/skills")
@RequiredArgsConstructor
public class SkillController {

    private final SkillService skillService;

    @GetMapping
    public ResponseEntity<List<SkillResponse>> getMySkills() {
        return ResponseEntity.ok(skillService.getMySkills());
    }

    @PostMapping
    public ResponseEntity<SkillResponse> addSkill(@Valid @RequestBody SkillRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(skillService.addSkill(request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeSkill(@PathVariable Long id) {
        skillService.removeSkill(id);
        return ResponseEntity.noContent().build();
    }
}
