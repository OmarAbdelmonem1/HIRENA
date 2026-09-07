package com.hirena.job.dto;

import com.hirena.job.entity.JobStatus;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class JobAnalyticsResponse {

    private Long jobId;
    private String title;
    private JobStatus status;
    private long totalViews;
    private long uniqueViewers;
    private long totalApplications;
}
