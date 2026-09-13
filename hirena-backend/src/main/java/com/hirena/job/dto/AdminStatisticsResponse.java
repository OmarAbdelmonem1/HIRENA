package com.hirena.job.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AdminStatisticsResponse {

    private long totalUsers;
    private long totalJobSeekers;
    private long totalCompanies;
    private long totalJobs;
    private long pendingJobs;
    private long approvedJobs;
    private long rejectedJobs;
    private long closedJobs;
    private long totalApplications;
}
