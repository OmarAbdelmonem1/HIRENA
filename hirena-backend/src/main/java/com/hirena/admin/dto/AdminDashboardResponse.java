package com.hirena.admin.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class AdminDashboardResponse {

    private Stats stats;
    private List<ApplicationOverviewItem> applicationOverview;
    private JobStatusCounts jobStatus;
    private List<RecentJob> recentJobs;
    private List<RecentApplication> recentApplications;

    @Getter
    @Setter
    @Builder
    public static class Stats {
        private long totalUsers;
        private long totalCompanies;
        private long activeJobs;
        private long totalApplications;
    }

    @Getter
    @Setter
    @Builder
    public static class ApplicationOverviewItem {
        private String day;
        private long applications;
        private long accepted;
    }

    @Getter
    @Setter
    @Builder
    public static class JobStatusCounts {
        private long total;
        private long active;
        private long pending;
        private long closed;
        private long draft;
    }

    @Getter
    @Setter
    @Builder
    public static class RecentJob {
        private Long id;
        private String title;
        private String companyName;
        private String location;
        private String status;
        private String createdAt;
    }

    @Getter
    @Setter
    @Builder
    public static class RecentApplication {
        private Long id;
        private String jobSeekerName;
        private String jobTitle;
        private String companyName;
        private String status;
        private String createdAt;
    }
}
