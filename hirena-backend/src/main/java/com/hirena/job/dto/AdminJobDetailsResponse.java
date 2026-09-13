package com.hirena.job.dto;
import lombok.*;
@Getter
@Builder
public class AdminJobDetailsResponse {
    private JobResponse job;
    private long applicationsCount;
    private long uniqueViewers;
    private long admittedApplications;
    private long rejectedApplications;
}
