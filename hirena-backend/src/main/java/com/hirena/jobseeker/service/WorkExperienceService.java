package com.hirena.jobseeker.service;

import com.hirena.jobseeker.dto.WorkExperienceRequest;
import com.hirena.jobseeker.dto.WorkExperienceResponse;
import com.hirena.jobseeker.entity.JobSeeker;
import com.hirena.jobseeker.entity.WorkExperience;
import com.hirena.jobseeker.exception.ResourceNotFoundException;
import com.hirena.jobseeker.repository.WorkExperienceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class WorkExperienceService {

    private final WorkExperienceRepository workExperienceRepository;
    private final JobSeekerService jobSeekerService;

    @Transactional(readOnly = true)
    public List<WorkExperienceResponse> getMyExperience() {
        JobSeeker jobSeeker = jobSeekerService.getJobSeekerForCurrentUser();
        return workExperienceRepository.findByJobSeekerId(jobSeeker.getId())
                .stream()
                .map(WorkExperienceResponse::fromEntity)
                .toList();
    }

    public WorkExperienceResponse addExperience(WorkExperienceRequest request) {
        JobSeeker jobSeeker = jobSeekerService.getJobSeekerForCurrentUser();

        WorkExperience experience = WorkExperience.builder()
                .jobSeeker(jobSeeker)
                .companyName(request.getCompanyName())
                .jobTitle(request.getJobTitle())
                .location(request.getLocation())
                .startDate(request.getStartDate())
                .endDate(request.isCurrentlyWorking() ? null : request.getEndDate())
                .currentlyWorking(request.isCurrentlyWorking())
                .description(request.getDescription())
                .build();

        WorkExperience saved = workExperienceRepository.save(experience);
        return WorkExperienceResponse.fromEntity(saved);
    }

    public WorkExperienceResponse updateExperience(Long experienceId, WorkExperienceRequest request) {
        WorkExperience experience = getOwnedExperienceOrThrow(experienceId);

        experience.setCompanyName(request.getCompanyName());
        experience.setJobTitle(request.getJobTitle());
        experience.setLocation(request.getLocation());
        experience.setStartDate(request.getStartDate());
        experience.setEndDate(request.isCurrentlyWorking() ? null : request.getEndDate());
        experience.setCurrentlyWorking(request.isCurrentlyWorking());
        experience.setDescription(request.getDescription());

        WorkExperience saved = workExperienceRepository.save(experience);
        return WorkExperienceResponse.fromEntity(saved);
    }

    public void deleteExperience(Long experienceId) {
        WorkExperience experience = getOwnedExperienceOrThrow(experienceId);
        workExperienceRepository.delete(experience);
    }

    private WorkExperience getOwnedExperienceOrThrow(Long experienceId) {
        JobSeeker jobSeeker = jobSeekerService.getJobSeekerForCurrentUser();
        return workExperienceRepository.findByIdAndJobSeekerId(experienceId, jobSeeker.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Work experience record not found: " + experienceId));
    }
}
