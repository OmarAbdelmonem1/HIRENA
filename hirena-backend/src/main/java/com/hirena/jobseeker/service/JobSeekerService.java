package com.hirena.jobseeker.service;

import com.hirena.jobseeker.dto.AdminJobSeekerListResponse;
import com.hirena.jobseeker.dto.CertificateRequest;
import com.hirena.jobseeker.dto.EducationRequest;
import com.hirena.jobseeker.dto.JobSeekerRequest;
import com.hirena.jobseeker.dto.JobSeekerResponse;
import com.hirena.jobseeker.dto.WorkExperienceRequest;
import com.hirena.jobseeker.entity.Certificate;
import com.hirena.jobseeker.entity.Education;
import com.hirena.jobseeker.entity.JobSeeker;
import com.hirena.jobseeker.entity.Skill;
import com.hirena.jobseeker.entity.WorkExperience;
import com.hirena.jobseeker.exception.BadRequestException;
import com.hirena.jobseeker.exception.ResourceNotFoundException;
import com.hirena.jobseeker.repository.JobSeekerRepository;
import com.hirena.jobseeker.repository.SkillRepository;
import com.hirena.auth.security.CurrentUserProvider;
import com.hirena.jobseeker.util.FileStorageService;
import com.hirena.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@Transactional
public class JobSeekerService {

    private final JobSeekerRepository jobSeekerRepository;
    private final SkillRepository skillRepository;
    private final CurrentUserProvider currentUserProvider;
    private final FileStorageService fileStorageService;

    // ── Profile CRUD ──────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public JobSeekerResponse getMyProfile() {
        return JobSeekerResponse.fromEntity(getJobSeekerForCurrentUser());
    }

    /**
     * Returns a paginated, lightweight projection of job seeker profiles for the
     * admin "Users" list screen. Full profile details (education, work experience,
     * certificates, skills, cv) are intentionally omitted here – see
     * {@link #getJobSeekerById(Long)} for the single-user detail view.
     */
    @Transactional(readOnly = true)
    public Page<AdminJobSeekerListResponse> getAllJobSeekers(Pageable pageable) {
        return jobSeekerRepository.findAll(pageable)
                .map(AdminJobSeekerListResponse::fromEntity);
    }

    /**
     * Returns one job seeker's full profile by its profile id for admin management screens.
     */
    @Transactional(readOnly = true)
    public JobSeekerResponse getJobSeekerById(Long id) {
        JobSeeker jobSeeker = jobSeekerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "JobSeeker profile not found with id: " + id));

        return JobSeekerResponse.fromEntity(jobSeeker);
    }

    public JobSeekerResponse createMyProfile(JobSeekerRequest request) {
        User currentUser = currentUserProvider.getCurrentUser();

        if (jobSeekerRepository.existsByUserId(currentUser.getId())) {
            throw new BadRequestException("A JobSeeker profile already exists for this account");
        }

        JobSeeker jobSeeker = JobSeeker.builder()
                .user(currentUser)
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhone())
                .dateOfBirth(request.getDateOfBirth())
                .gender(request.getGender())
                .address(request.getAddress())
                .city(request.getCity())
                .country(request.getCountry())
                .bio(request.getBio())
                .currentJobTitle(request.getCurrentJobTitle())
                .yearsOfExperience(request.getYearsOfExperience())
                .expectedSalary(request.getExpectedSalary())
                .availability(request.getAvailability())
                .build();

        populateNestedEntities(jobSeeker, request);

        return JobSeekerResponse.fromEntity(jobSeekerRepository.save(jobSeeker));
    }

    public JobSeekerResponse updateMyProfile(JobSeekerRequest request) {
        JobSeeker jobSeeker = getJobSeekerForCurrentUser();

        jobSeeker.setFirstName(request.getFirstName());
        jobSeeker.setLastName(request.getLastName());
        jobSeeker.setPhone(request.getPhone());
        jobSeeker.setDateOfBirth(request.getDateOfBirth());
        jobSeeker.setGender(request.getGender());
        jobSeeker.setAddress(request.getAddress());
        jobSeeker.setCity(request.getCity());
        jobSeeker.setCountry(request.getCountry());
        jobSeeker.setBio(request.getBio());
        jobSeeker.setCurrentJobTitle(request.getCurrentJobTitle());
        jobSeeker.setYearsOfExperience(request.getYearsOfExperience());
        jobSeeker.setExpectedSalary(request.getExpectedSalary());
        jobSeeker.setAvailability(request.getAvailability());

        populateNestedEntities(jobSeeker, request);

        return JobSeekerResponse.fromEntity(jobSeekerRepository.save(jobSeeker));
    }

    private void populateNestedEntities(JobSeeker jobSeeker, JobSeekerRequest request) {
        if (request.getEducation() != null) {
            jobSeeker.getEducationList().clear();
            for (EducationRequest eduReq : request.getEducation()) {
                Education edu = Education.builder()
                        .jobSeeker(jobSeeker)
                        .institutionName(eduReq.getInstitutionName())
                        .degree(eduReq.getDegree())
                        .fieldOfStudy(eduReq.getFieldOfStudy())
                        .startDate(eduReq.getStartDate())
                        .endDate(eduReq.getEndDate())
                        .grade(eduReq.getGrade())
                        .description(eduReq.getDescription())
                        .build();
                jobSeeker.getEducationList().add(edu);
            }
        }

        if (request.getWorkExperience() != null) {
            jobSeeker.getWorkExperienceList().clear();
            for (WorkExperienceRequest expReq : request.getWorkExperience()) {
                WorkExperience exp = WorkExperience.builder()
                        .jobSeeker(jobSeeker)
                        .companyName(expReq.getCompanyName())
                        .jobTitle(expReq.getJobTitle())
                        .location(expReq.getLocation())
                        .startDate(expReq.getStartDate())
                        .endDate(expReq.getEndDate())
                        .currentlyWorking(expReq.isCurrentlyWorking())
                        .description(expReq.getDescription())
                        .build();
                jobSeeker.getWorkExperienceList().add(exp);
            }
        }

        if (request.getCertificates() != null) {
            jobSeeker.getCertificateList().clear();
            for (CertificateRequest certReq : request.getCertificates()) {
                Certificate cert = Certificate.builder()
                        .jobSeeker(jobSeeker)
                        .name(certReq.getName())
                        .issuingOrganization(certReq.getIssuingOrganization())
                        .issueDate(certReq.getIssueDate())
                        .expirationDate(certReq.getExpirationDate())
                        .credentialId(certReq.getCredentialId())
                        .credentialUrl(certReq.getCredentialUrl())
                        .build();
                jobSeeker.getCertificateList().add(cert);
            }
        }

        if (request.getSkills() != null && skillRepository != null) {
            jobSeeker.getSkills().clear();
            for (String skillName : request.getSkills()) {
                if (skillName != null && !skillName.trim().isEmpty()) {
                    Skill skill = skillRepository.findByNameIgnoreCase(skillName.trim())
                            .orElseGet(() -> skillRepository.save(
                                    Skill.builder().name(skillName.trim()).build()));
                    jobSeeker.getSkills().add(skill);
                }
            }
        }
    }

    public void deleteMyProfile() {
        JobSeeker jobSeeker = getJobSeekerForCurrentUser();
        // Clean up files before deleting (CV file deleted via cascade if needed,
        // but profile image path is just a String so delete manually)
        fileStorageService.deleteProfileImage(jobSeeker.getProfileImage());
        if (jobSeeker.getCv() != null) {
            fileStorageService.deleteCv(jobSeeker.getCv().getFilePath());
        }
        jobSeekerRepository.delete(jobSeeker);
    }

    // ── Profile image ─────────────────────────────────────────────────────

    public JobSeekerResponse uploadProfileImage(MultipartFile file) {
        JobSeeker jobSeeker = getJobSeekerForCurrentUser();

        // Delete old image if one exists
        fileStorageService.deleteProfileImage(jobSeeker.getProfileImage());

        String path = fileStorageService.storeProfileImage(file);
        jobSeeker.setProfileImage(path);

        return JobSeekerResponse.fromEntity(jobSeekerRepository.save(jobSeeker));
    }

    public void deleteProfileImage() {
        JobSeeker jobSeeker = getJobSeekerForCurrentUser();
        if (jobSeeker.getProfileImage() == null) {
            throw new BadRequestException("No profile image to delete");
        }
        fileStorageService.deleteProfileImage(jobSeeker.getProfileImage());
        jobSeeker.setProfileImage(null);
        jobSeekerRepository.save(jobSeeker);
    }

    // ── Shared helper used by all child services ──────────────────────────

    /**
     * Resolves the JobSeeker that belongs to the currently authenticated user.
     * Identity is derived from the JWT via SecurityContext – never from a client-supplied id.
     */
    @Transactional(readOnly = true)
    public JobSeeker getJobSeekerForCurrentUser() {
        Long userId = currentUserProvider.getCurrentUserId();
        return jobSeekerRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "JobSeeker profile not found. Create a profile first."));
    }
}
