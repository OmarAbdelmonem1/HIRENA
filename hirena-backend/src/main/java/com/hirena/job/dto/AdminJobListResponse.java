package com.hirena.job.dto;
import com.hirena.job.entity.*;
import lombok.*;
import java.time.LocalDateTime;
@Getter @Builder public class AdminJobListResponse {
 private Long id; private String title; private String companyName; private String location; private EmploymentType employmentType; private Integer experienceRequired; private JobStatus status; private long applicationsCount; private LocalDateTime createdAt;
 public static AdminJobListResponse from(Job j,long count){return builder().id(j.getId()).title(j.getTitle()).companyName(j.getCompany().getCompanyName()).location(j.getLocation()).employmentType(j.getEmploymentType()).experienceRequired(j.getExperienceRequired()).status(j.getStatus()).applicationsCount(count).createdAt(j.getCreatedAt()).build();}
}
