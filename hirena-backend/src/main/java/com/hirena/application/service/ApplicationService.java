package com.hirena.application.service;

import com.hirena.application.dto.ApplicationRequest;
import com.hirena.application.dto.ApplicationResponse;
import com.hirena.application.dto.ApplicationStatusUpdateRequest;
import com.hirena.application.entity.Application;
import com.hirena.application.entity.ApplicationStatus;
import com.hirena.application.entity.CvAnalysis;
import com.hirena.application.repository.ApplicationRepository;
import com.hirena.auth.security.CurrentUserProvider;
import com.hirena.company.entity.Company;
import com.hirena.company.service.CompanyService;
import com.hirena.exception.BadRequestException;
import com.hirena.exception.ResourceNotFoundException;
import com.hirena.job.entity.Job;
import com.hirena.job.entity.JobStatus;
import com.hirena.job.repository.JobRepository;
import com.hirena.jobseeker.entity.JobSeeker;
import com.hirena.jobseeker.repository.JobSeekerRepository;
import com.hirena.jobseeker.entity.CV;
import lombok.RequiredArgsConstructor;
import com.hirena.notification.service.NotificationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final JobSeekerRepository jobSeekerRepository;
    private final CompanyService companyService;
    private final CurrentUserProvider currentUserProvider;
    private final NotificationService notificationService;
    private final ApplicationCvAnalysisAsyncService applicationCvAnalysisAsyncService;

    // ── JobSeeker: apply ──────────────────────────────────────────────────

    public ApplicationResponse apply(Long jobId, ApplicationRequest request) {
        JobSeeker jobSeeker = resolveJobSeeker();

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        if (job.getStatus() != JobStatus.APPROVED) {
            throw new BadRequestException("You can only apply to APPROVED jobs");
        }

        if (applicationRepository.existsByJobIdAndJobSeekerId(jobId, jobSeeker.getId())) {
            throw new BadRequestException("You have already applied to this job");
        }

        Application application = Application.builder()
                .job(job)
                .jobSeeker(jobSeeker)
                .coverLetter(request != null ? request.getCoverLetter() : null)
                .status(ApplicationStatus.PENDING)
                .build();

        CvAnalysis cvAnalysis = CvAnalysis.builder()
                .application(application)
                .status(jobSeeker.getCv() == null
                        ? com.hirena.application.entity.CvAnalysisStatus.NOT_ANALYZED
                        : com.hirena.application.entity.CvAnalysisStatus.ANALYZING)
                .build();
        application.setCvAnalysis(cvAnalysis);
        Application saved = applicationRepository.save(application);
        notificationService.applicationSubmitted(saved);
        if (saved.getCvAnalysis().getStatus()
                == com.hirena.application.entity.CvAnalysisStatus.ANALYZING) {
            Long applicationId = saved.getId();
            TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
                @Override
                public void afterCommit() {
                    applicationCvAnalysisAsyncService.analyze(applicationId);
                }
            });
        }
        return ApplicationResponse.fromEntity(saved, false);
    }

    // ── JobSeeker: own applications ───────────────────────────────────────

    @Transactional(readOnly = true)
    public List<ApplicationResponse> getMyApplications() {
        JobSeeker jobSeeker = resolveJobSeeker();
        return applicationRepository.findAllByJobSeekerId(jobSeeker.getId())
                .stream()
                .map(application -> ApplicationResponse.fromEntity(application, false))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ApplicationResponse getMyApplication(Long applicationId) {
        JobSeeker jobSeeker = resolveJobSeeker();
        Application application = applicationRepository.findByIdAndJobSeekerId(applicationId, jobSeeker.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));
        return ApplicationResponse.fromEntity(application, false);
    }

    public void deleteMyApplication(Long applicationId) {
        JobSeeker jobSeeker = resolveJobSeeker();
        Application application = applicationRepository.findByIdAndJobSeekerId(applicationId, jobSeeker.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));

        if (application.getStatus() != ApplicationStatus.PENDING) {
            throw new BadRequestException("Only PENDING applications can be withdrawn");
        }

        applicationRepository.delete(application);
    }

    // ── Company: view applicants ──────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<ApplicationResponse> getApplicationsForJob(Long jobId) {
        assertJobOwnedByCurrentCompany(jobId);
        return applicationRepository.findAllByJobId(jobId)
                .stream()
                .map(ApplicationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public ApplicationResponse getApplicationForJob(Long jobId, Long applicationId) {
        assertJobOwnedByCurrentCompany(jobId);
        Application application = applicationRepository.findByIdAndJobId(applicationId, jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));
        recordCompanyView(application);
        return ApplicationResponse.fromEntity(application);
    }

    public ApplicationResponse updateApplicationStatus(Long jobId, Long applicationId,
                                                        ApplicationStatusUpdateRequest request) {
        assertJobOwnedByCurrentCompany(jobId);
        Application application = applicationRepository.findByIdAndJobId(applicationId, jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));

        validateStatusTransition(application.getStatus(), request.getStatus());
        boolean changed = application.getStatus() != request.getStatus();

        application.setStatus(request.getStatus());
        Application saved = applicationRepository.save(application);
        if (changed) {
            notificationService.applicationStatusChanged(saved);
        }
        return ApplicationResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<ApplicationResponse> getApplicationsForCurrentCompany() {
        Company company = companyService.getCompanyForCurrentUser();
        return applicationRepository.findAllByJobCompanyId(company.getId())
                .stream()
                .map(ApplicationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public ApplicationResponse getCompanyApplication(Long applicationId) {
        Company company = companyService.getCompanyForCurrentUser();
        Application application = applicationRepository.findByIdAndJobCompanyId(applicationId, company.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Application not found or does not belong to your company"));
        recordCompanyView(application);
        return ApplicationResponse.fromEntity(application);
    }

    @Transactional(readOnly = true)
    public CV getCompanyApplicationCv(Long applicationId) {
        Company company = companyService.getCompanyForCurrentUser();
        Application application = applicationRepository.findByIdAndJobCompanyId(applicationId, company.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Application not found or does not belong to your company"));
        CV cv = application.getJobSeeker().getCv();
        if (cv == null) {
            throw new ResourceNotFoundException("This candidate has not uploaded a CV");
        }
        return cv;
    }

    @Transactional(readOnly = true)
    public CV getAdminApplicationCv(Long applicationId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Application not found with id: " + applicationId));
        CV cv = application.getJobSeeker().getCv();
        if (cv == null) {
            throw new ResourceNotFoundException("This candidate has not uploaded a CV");
        }
        return cv;
    }

    public ApplicationResponse updateCompanyApplicationStatus(
            Long applicationId, ApplicationStatusUpdateRequest request) {
        Company company = companyService.getCompanyForCurrentUser();
        Application application = applicationRepository.findByIdAndJobCompanyId(applicationId, company.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Application not found or does not belong to your company"));

        validateStatusTransition(application.getStatus(), request.getStatus());
        boolean changed = application.getStatus() != request.getStatus();
        application.setStatus(request.getStatus());
        Application saved = applicationRepository.save(application);
        if (changed) {
            notificationService.applicationStatusChanged(saved);
        }
        return ApplicationResponse.fromEntity(saved);
    }

    private void recordCompanyView(Application application) {
        if (application.getCompanyViewedAt() == null) {
            application.setCompanyViewedAt(java.time.LocalDateTime.now());
            applicationRepository.save(application);
            notificationService.applicationViewed(application);
        }
    }

    // ── Helpers ───────────────────────────────────────────────────────────

    private void validateStatusTransition(ApplicationStatus current, ApplicationStatus next) {
        boolean valid = switch (current) {
            case PENDING -> next == ApplicationStatus.REVIEWING
                    || next == ApplicationStatus.ACCEPTED
                    || next == ApplicationStatus.REJECTED;
            case REVIEWING -> next == ApplicationStatus.ACCEPTED || next == ApplicationStatus.REJECTED;
            default -> false;
        };
        if (!valid) {
            throw new BadRequestException(
                    "Invalid status transition from " + current + " to " + next);
        }
    }

    private void assertJobOwnedByCurrentCompany(Long jobId) {
        Company company = companyService.getCompanyForCurrentUser();
        jobRepository.findByIdAndCompanyId(jobId, company.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Job not found or does not belong to your company"));
    }

    private JobSeeker resolveJobSeeker() {
        Long userId = currentUserProvider.getCurrentUserId();
        return jobSeekerRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "JobSeeker profile not found. Create a profile first."));
    } 
    //admin 
@Transactional(readOnly = true)
public Page<ApplicationResponse> getAllApplications(Pageable pageable) {

    return applicationRepository
            .findAll(pageable)
            .map(ApplicationResponse::fromEntity);
}
@Transactional(readOnly = true)
public ApplicationResponse getApplicationById(Long id) {

    Application application = applicationRepository
            .findById(id)
            .orElseThrow(() ->
                    new RuntimeException("Application not found")
            );

    return ApplicationResponse.fromEntity(application);
}
}
