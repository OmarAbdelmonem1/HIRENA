package com.hirena.job.service;

import com.hirena.application.repository.ApplicationRepository;
import com.hirena.application.entity.ApplicationStatus;
import com.hirena.auth.security.CurrentUserProvider;
import com.hirena.company.entity.Company;
import com.hirena.company.service.CompanyService;
import com.hirena.exception.BadRequestException;
import com.hirena.exception.ResourceNotFoundException;
import com.hirena.job.dto.AdminJobRejectionRequest;
import com.hirena.job.dto.AdminJobListResponse;
import com.hirena.job.dto.AdminJobDetailsResponse;
import com.hirena.job.dto.JobAnalyticsResponse;
import com.hirena.job.dto.JobRequest;
import com.hirena.job.dto.JobResponse;
import com.hirena.job.entity.Job;
import com.hirena.job.entity.JobStatus;
import com.hirena.job.entity.EmploymentType;
import com.hirena.job.entity.JobCategory;
import com.hirena.job.entity.JobView;
import com.hirena.job.repository.JobRepository;
import com.hirena.job.repository.JobViewRepository;
import com.hirena.jobseeker.repository.JobSeekerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class JobService {

    private final JobRepository jobRepository;
    private final JobViewRepository jobViewRepository;
    private final ApplicationRepository applicationRepository;
    private final CompanyService companyService;
    private final CurrentUserProvider currentUserProvider;
    private final JobSeekerRepository jobSeekerRepository;

    // ── Company: CRUD ─────────────────────────────────────────────────────

    public JobResponse createJob(JobRequest request) {
        Company company = companyService.getCompanyForCurrentUser();

        Job job = Job.builder()
                .company(company)
                .title(request.getTitle())
                .description(request.getDescription())
                .requirements(request.getRequirements())
                .location(request.getLocation())
                .salaryMin(request.getSalaryMin())
                .salaryMax(request.getSalaryMax())
                .employmentType(request.getEmploymentType())
                .category(request.getCategory())
                .experienceRequired(request.getExperienceRequired())
                .deadline(request.getDeadline())
                .status(JobStatus.PENDING)
                .build();

        Job saved = jobRepository.save(job);
        return JobResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<JobResponse> getMyCompanyJobs() {
        Company company = companyService.getCompanyForCurrentUser();
        return jobRepository.findAllByCompanyId(company.getId())
                .stream()
                .map(JobResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public JobResponse getMyCompanyJob(Long jobId) {
        Company company = companyService.getCompanyForCurrentUser();
        Job job = jobRepository.findByIdAndCompanyId(jobId, company.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Job not found or does not belong to your company"));
        return JobResponse.fromEntity(job)
                .toBuilder()
                .uniqueViewers(jobViewRepository.countDistinctJobSeekerByJobId(jobId))
                .build();
    }

    public JobResponse updateJob(Long jobId, JobRequest request) {
        Company company = companyService.getCompanyForCurrentUser();
        Job job = jobRepository.findByIdAndCompanyId(jobId, company.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Job not found or does not belong to your company"));

        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setRequirements(request.getRequirements());
        job.setLocation(request.getLocation());
        job.setSalaryMin(request.getSalaryMin());
        job.setSalaryMax(request.getSalaryMax());
        job.setEmploymentType(request.getEmploymentType());
        job.setCategory(request.getCategory());
        job.setExperienceRequired(request.getExperienceRequired());
        job.setDeadline(request.getDeadline());
        // Reset to PENDING so admin re-reviews after edits
        job.setStatus(JobStatus.PENDING);
        job.setRejectionReason(null);

        Job saved = jobRepository.save(job);
        return JobResponse.fromEntity(saved);
    }

    public void deleteJob(Long jobId) {
        Company company = companyService.getCompanyForCurrentUser();
        Job job = jobRepository.findByIdAndCompanyId(jobId, company.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Job not found or does not belong to your company"));
        jobRepository.delete(job);
    }

    // ── Admin: approval ───────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<JobResponse> getPendingJobs() {
        return jobRepository.findAllByStatus(JobStatus.PENDING)
                .stream()
                .map(JobResponse::fromEntity)
                .collect(Collectors.toList());
    }
@Transactional(readOnly = true)
public Page<AdminJobListResponse> getAdminJobs(Pageable pageable) {

    return jobRepository
            .findAll(pageable)
            .map(j -> AdminJobListResponse.from(
                    j,
                    applicationRepository.countByJobId(j.getId())
            ));
}
    @Transactional(readOnly = true)
    public AdminJobDetailsResponse getAdminJob(Long id) {
        Job job = jobRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));
        return AdminJobDetailsResponse.builder()
                .job(JobResponse.fromEntity(job))
                .applicationsCount(applicationRepository.countByJobId(id))
                .uniqueViewers(jobViewRepository.countDistinctJobSeekerByJobId(id))
                .admittedApplications(applicationRepository.countByJobIdAndStatus(id, ApplicationStatus.ACCEPTED))
                .rejectedApplications(applicationRepository.countByJobIdAndStatus(id, ApplicationStatus.REJECTED))
                .build();
    }

    public JobResponse updateAdminJob(Long id, JobRequest request) {
        Job job = jobRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));
        job.setTitle(request.getTitle()); job.setDescription(request.getDescription()); job.setRequirements(request.getRequirements()); job.setLocation(request.getLocation()); job.setSalaryMin(request.getSalaryMin()); job.setSalaryMax(request.getSalaryMax()); job.setEmploymentType(request.getEmploymentType()); job.setExperienceRequired(request.getExperienceRequired()); job.setDeadline(request.getDeadline());
        Job saved = jobRepository.save(job);
        return JobResponse.fromEntity(saved);
    }

    public void deleteAdminJob(Long id) {
        Job job = jobRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));
        applicationRepository.deleteByJobId(id); jobRepository.delete(job);
    }

    private String blank(String value) { return value == null || value.isBlank() ? null : value.trim(); }

    public JobResponse approveJob(Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        if (job.getStatus() != JobStatus.PENDING) {
            throw new BadRequestException("Only PENDING jobs can be approved. Current status: " + job.getStatus());
        }

        job.setStatus(JobStatus.APPROVED);
        job.setRejectionReason(null);
        Job saved = jobRepository.save(job);
        return JobResponse.fromEntity(saved);
    }

    public JobResponse rejectJob(Long jobId, AdminJobRejectionRequest request) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        if (job.getStatus() != JobStatus.PENDING) {
            throw new BadRequestException("Only PENDING jobs can be rejected. Current status: " + job.getStatus());
        }

        job.setStatus(JobStatus.REJECTED);
        if (request != null && request.getRejectionReason() != null) {
            job.setRejectionReason(request.getRejectionReason());
        }
        Job saved = jobRepository.save(job);
        return JobResponse.fromEntity(saved);
    }

    // ── Public / JobSeeker: approved jobs ────────────────────────────────

    @Transactional(readOnly = true)
    public Page<JobResponse> getApprovedJobs(Pageable pageable, String keyword, String location,
                                             EmploymentType employmentType, JobCategory category,
                                             Integer minExperience) {
        Specification<Job> specification = (root, query, criteriaBuilder) -> {
            var predicates = criteriaBuilder.and(
                    criteriaBuilder.equal(root.get("status"), JobStatus.APPROVED));

            String normalizedKeyword = blank(keyword);
            if (normalizedKeyword != null) {
                String pattern = "%" + normalizedKeyword.toLowerCase() + "%";
                var company = root.join("company");
                predicates = criteriaBuilder.and(predicates, criteriaBuilder.or(
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), pattern),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), pattern),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("requirements")), pattern),
                        criteriaBuilder.like(criteriaBuilder.lower(company.get("companyName")), pattern)));
            }

            String normalizedLocation = blank(location);
            if (normalizedLocation != null) {
                predicates = criteriaBuilder.and(predicates,
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("location")),
                                "%" + normalizedLocation.toLowerCase() + "%"));
            }

            if (employmentType != null) {
                predicates = criteriaBuilder.and(predicates,
                        criteriaBuilder.equal(root.get("employmentType"), employmentType));
            }
            if (category != null) {
                predicates = criteriaBuilder.and(predicates,
                        criteriaBuilder.equal(root.get("category"), category));
            }

            if (minExperience != null) {
                predicates = criteriaBuilder.and(predicates,
                        criteriaBuilder.greaterThanOrEqualTo(root.get("experienceRequired"), minExperience));
            }

            return predicates;
        };

        return jobRepository.findAll(specification, pageable)
                .map(JobResponse::fromEntity);
    }

    @Transactional
    public JobResponse getApprovedJobById(Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        if (job.getStatus() != JobStatus.APPROVED) {
            throw new ResourceNotFoundException("Job not found with id: " + jobId);
        }

        // Record view if the requester is an authenticated JobSeeker
        tryRecordView(job);

        return JobResponse.fromEntity(job)
                .toBuilder()
                .uniqueViewers(jobViewRepository.countDistinctJobSeekerByJobId(jobId))
                .build();
    }

    private void tryRecordView(Job job) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
                return;
            }

            Long userId = currentUserProvider.getCurrentUserId();
            jobSeekerRepository.findByUserId(userId).ifPresent(jobSeeker -> {
                LocalDateTime windowStart = LocalDateTime.now().minusHours(24);
                boolean alreadyViewed = jobViewRepository
                        .findTopByJobIdAndJobSeekerIdAndViewedAtAfter(job.getId(), jobSeeker.getId(), windowStart)
                        .isPresent();

                if (!alreadyViewed) {
                    JobView view = JobView.builder()
                            .job(job)
                            .jobSeeker(jobSeeker)
                            .viewedAt(LocalDateTime.now())
                            .build();
                    jobViewRepository.save(view);
                }
            });
        } catch (Exception ignored) {
            // Never fail a public read because of view tracking
        }
    }

    // ── Company analytics ─────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public JobAnalyticsResponse getJobAnalytics(Long jobId) {
        Company company = companyService.getCompanyForCurrentUser();
        Job job = jobRepository.findByIdAndCompanyId(jobId, company.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Job not found or does not belong to your company"));

        long totalViews = jobViewRepository.countByJobId(jobId);
        long uniqueViewers = jobViewRepository.countDistinctJobSeekerByJobId(jobId);
        long totalApplications = applicationRepository.countByJobId(jobId);

        return JobAnalyticsResponse.builder()
                .jobId(job.getId())
                .title(job.getTitle())
                .status(job.getStatus())
                .totalViews(totalViews)
                .uniqueViewers(uniqueViewers)
                .totalApplications(totalApplications)
                .admittedApplications(applicationRepository.countByJobIdAndStatus(jobId, ApplicationStatus.ACCEPTED))
                .rejectedApplications(applicationRepository.countByJobIdAndStatus(jobId, ApplicationStatus.REJECTED))
                .build();
    }
}
