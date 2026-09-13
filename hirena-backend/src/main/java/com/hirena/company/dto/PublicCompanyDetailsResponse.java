package com.hirena.company.dto;

import com.hirena.job.dto.JobResponse;
import lombok.Builder;
import lombok.Getter;
import org.springframework.data.domain.Page;

@Getter
@Builder
public class PublicCompanyDetailsResponse {
    private CompanyResponse company;
    private Page<JobResponse> jobs;
}
