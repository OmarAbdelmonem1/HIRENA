package com.hirena.jobseeker.service;

import com.hirena.jobseeker.dto.EducationRequest;
import com.hirena.jobseeker.dto.EducationResponse;
import com.hirena.jobseeker.entity.Education;
import com.hirena.jobseeker.entity.JobSeeker;
import com.hirena.jobseeker.exception.ResourceNotFoundException;
import com.hirena.jobseeker.repository.EducationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class EducationService {

    private final EducationRepository educationRepository;
    private final JobSeekerService jobSeekerService;

    @Transactional(readOnly = true)
    public List<EducationResponse> getMyEducation() {
        JobSeeker jobSeeker = jobSeekerService.getJobSeekerForCurrentUser();
        return educationRepository.findByJobSeekerId(jobSeeker.getId())
                .stream()
                .map(EducationResponse::fromEntity)
                .toList();
    }

    public EducationResponse addEducation(EducationRequest request) {
        JobSeeker jobSeeker = jobSeekerService.getJobSeekerForCurrentUser();

        Education education = Education.builder()
                .jobSeeker(jobSeeker)
                .institutionName(request.getInstitutionName())
                .degree(request.getDegree())
                .fieldOfStudy(request.getFieldOfStudy())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .grade(request.getGrade())
                .description(request.getDescription())
                .build();

        Education saved = educationRepository.save(education);
        return EducationResponse.fromEntity(saved);
    }

    public EducationResponse updateEducation(Long educationId, EducationRequest request) {
        Education education = getOwnedEducationOrThrow(educationId);

        education.setInstitutionName(request.getInstitutionName());
        education.setDegree(request.getDegree());
        education.setFieldOfStudy(request.getFieldOfStudy());
        education.setStartDate(request.getStartDate());
        education.setEndDate(request.getEndDate());
        education.setGrade(request.getGrade());
        education.setDescription(request.getDescription());

        Education saved = educationRepository.save(education);
        return EducationResponse.fromEntity(saved);
    }

    public void deleteEducation(Long educationId) {
        Education education = getOwnedEducationOrThrow(educationId);
        educationRepository.delete(education);
    }

    /**
     * Loads the Education row scoped to the current user's JobSeeker id in
     * a single query, so a request for someone else's Education id simply
     * returns 404 - never leaking whether the id exists at all.
     */
    private Education getOwnedEducationOrThrow(Long educationId) {
        JobSeeker jobSeeker = jobSeekerService.getJobSeekerForCurrentUser();
        return educationRepository.findByIdAndJobSeekerId(educationId, jobSeeker.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Education record not found: " + educationId));
    }
}
