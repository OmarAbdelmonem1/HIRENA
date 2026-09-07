package com.hirena.jobseeker.service;

import com.hirena.jobseeker.dto.SkillRequest;
import com.hirena.jobseeker.dto.SkillResponse;
import com.hirena.jobseeker.entity.JobSeeker;
import com.hirena.jobseeker.entity.Skill;
import com.hirena.jobseeker.exception.BadRequestException;
import com.hirena.jobseeker.exception.ResourceNotFoundException;
import com.hirena.jobseeker.repository.JobSeekerRepository;
import com.hirena.jobseeker.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class SkillService {

    private final SkillRepository skillRepository;
    private final JobSeekerRepository jobSeekerRepository;
    private final JobSeekerService jobSeekerService;

    @Transactional(readOnly = true)
    public List<SkillResponse> getMySkills() {
        JobSeeker jobSeeker = jobSeekerService.getJobSeekerForCurrentUser();
        return jobSeeker.getSkills().stream()
                .map(SkillResponse::fromEntity)
                .toList();
    }

    public SkillResponse addSkill(SkillRequest request) {
        JobSeeker jobSeeker = jobSeekerService.getJobSeekerForCurrentUser();

        // Find or create the shared Skill row
        Skill skill = skillRepository.findByNameIgnoreCase(request.getName().trim())
                .orElseGet(() -> skillRepository.save(
                        Skill.builder().name(request.getName().trim()).build()));

        // Prevent duplicate for this JobSeeker
        boolean alreadyHasSkill = jobSeeker.getSkills().stream()
                .anyMatch(s -> s.getId().equals(skill.getId()));
        if (alreadyHasSkill) {
            throw new BadRequestException("Skill '" + skill.getName() + "' is already in your profile");
        }

        jobSeeker.getSkills().add(skill);
        jobSeekerRepository.save(jobSeeker);

        return SkillResponse.fromEntity(skill);
    }

    public void removeSkill(Long skillId) {
        JobSeeker jobSeeker = jobSeekerService.getJobSeekerForCurrentUser();

        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found: " + skillId));

        boolean removed = jobSeeker.getSkills().remove(skill);
        if (!removed) {
            throw new ResourceNotFoundException("Skill " + skillId + " not found in your profile");
        }

        jobSeekerRepository.save(jobSeeker);
    }
}
