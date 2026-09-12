package com.hirena.admin.service;

import com.hirena.admin.dto.AdminDashboardResponse;
import com.hirena.application.entity.Application;
import com.hirena.application.entity.ApplicationStatus;
import com.hirena.application.repository.ApplicationRepository;
import com.hirena.company.repository.CompanyRepository;
import com.hirena.job.entity.Job;
import com.hirena.job.entity.JobStatus;
import com.hirena.job.repository.JobRepository;
import com.hirena.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;

    /**
     * Build the dashboard payload aggregating multiple repository queries.
     */
    @Transactional(readOnly = true)
    public AdminDashboardResponse getDashboard() {
        // 1. Stats
        long totalUsers = userRepository.count();
        long totalCompanies = companyRepository.count();
        long activeJobs = jobRepository.countByStatus(JobStatus.APPROVED); // APPROVED == active
        long totalApplications = applicationRepository.count();

        AdminDashboardResponse.Stats stats = AdminDashboardResponse.Stats.builder()
                .totalUsers(totalUsers)
                .totalCompanies(totalCompanies)
                .activeJobs(activeJobs)
                .totalApplications(totalApplications)
                .build();

        // 2. Application overview for last 7 days (including today)
        LocalDate today = LocalDate.now();
        LocalDate fromDate = today.minusDays(6);
        LocalDateTime fromDateTime = fromDate.atStartOfDay();

        List<Application> recentApps = applicationRepository.findAll().stream()
                .filter(a -> a.getAppliedAt() != null && !a.getAppliedAt().isBefore(fromDateTime))
                .collect(Collectors.toList());

        // group by date
        Map<LocalDate, List<Application>> byDate = recentApps.stream()
                .collect(Collectors.groupingBy(a -> a.getAppliedAt().toLocalDate()));

        List<AdminDashboardResponse.ApplicationOverviewItem> overview = new ArrayList<>();
        for (int i = 0; i < 7; i++) {
            LocalDate d = fromDate.plusDays(i);
            List<Application> apps = byDate.getOrDefault(d, List.of());
            long applications = apps.size();
            long accepted = apps.stream().filter(app -> app.getStatus() == ApplicationStatus.ACCEPTED).count();
            String dayName = d.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            overview.add(AdminDashboardResponse.ApplicationOverviewItem.builder()
                    .day(dayName)
                    .applications(applications)
                    .accepted(accepted)
                    .build());
        }

        // 3. Job status counts
        long totalJobs = jobRepository.count();
        long active = jobRepository.countByStatus(JobStatus.APPROVED);
        long pending = jobRepository.countByStatus(JobStatus.PENDING);
        long closed = jobRepository.countByStatus(JobStatus.CLOSED);
        long draft = 0L; // there is no DRAFT status in the current model

        AdminDashboardResponse.JobStatusCounts jobStatus = AdminDashboardResponse.JobStatusCounts.builder()
                .total(totalJobs)
                .active(active)
                .pending(pending)
                .closed(closed)
                .draft(draft)
                .build();

        // 4. Recent jobs (latest 10)
        List<Job> jobsPage = jobRepository.findAll(PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "createdAt"))).getContent();
        List<AdminDashboardResponse.RecentJob> recentJobs = jobsPage.stream()
                .sorted(Comparator.comparing(Job::getCreatedAt).reversed())
                .map(j -> AdminDashboardResponse.RecentJob.builder()
                        .id(j.getId())
                        .title(j.getTitle())
                        .companyName(j.getCompany() != null ? j.getCompany().getCompanyName() : null)
                        .location(j.getLocation())
                        .status(j.getStatus() != null ? j.getStatus().name() : null)
                        .createdAt(j.getCreatedAt() != null ? j.getCreatedAt().toString() : null)
                        .build())
                .collect(Collectors.toList());

        // 5. Recent applications (latest 10)
        List<Application> applicationPage = applicationRepository.findAll(PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "appliedAt"))).getContent();
        List<AdminDashboardResponse.RecentApplication> recentApplications = applicationPage.stream()
                .sorted(Comparator.comparing(Application::getAppliedAt).reversed())
                .map(a -> {
                                        String jobSeekerName = null;
                                        if (a.getJobSeeker() != null) {
                                            String fn = a.getJobSeeker().getFirstName();
                                            String ln = a.getJobSeeker().getLastName();
                                            jobSeekerName = ((fn != null ? fn : "") + " " + (ln != null ? ln : "")).trim();
                                            if (jobSeekerName.isEmpty()) jobSeekerName = null;
                                        }
                                        return AdminDashboardResponse.RecentApplication.builder()
                                                .id(a.getId())
                                                .jobSeekerName(jobSeekerName)
                                                .jobTitle(a.getJob() != null ? a.getJob().getTitle() : null)
                                                .companyName(a.getJob() != null && a.getJob().getCompany() != null ? a.getJob().getCompany().getCompanyName() : null)
                                                .status(a.getStatus() != null ? a.getStatus().name() : null)
                                                .createdAt(a.getAppliedAt() != null ? a.getAppliedAt().toString() : null)
                                                .build();
                                    })
                                .collect(Collectors.toList());

        return AdminDashboardResponse.builder()
                .stats(stats)
                .applicationOverview(overview)
                .jobStatus(jobStatus)
                .recentJobs(recentJobs)
                .recentApplications(recentApplications)
                .build();
    }
}
