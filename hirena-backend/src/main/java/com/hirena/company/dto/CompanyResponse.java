package com.hirena.company.dto;

import com.hirena.company.entity.Company;
import com.hirena.company.entity.Industry;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class CompanyResponse {

    private Long id;
    private Long userId;
    private String companyName;
    private String description;
    private Industry industry;
    private String companyPhone;
    private String website;
    private String address;
    private String city;
    private String country;
    private Integer foundedYear;
    private String companySize;
    private String logo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static CompanyResponse fromEntity(Company company) {
        return CompanyResponse.builder()
                .id(company.getId())
                .userId(company.getUser() != null ? company.getUser().getId() : null)
                .companyName(company.getCompanyName())
                .description(company.getDescription())
                .industry(company.getIndustry())
                .companyPhone(company.getCompanyPhone())
                .website(company.getWebsite())
                .address(company.getAddress())
                .city(company.getCity())
                .country(company.getCountry())
                .foundedYear(company.getFoundedYear())
                .companySize(company.getCompanySize())
                .logo(company.getLogo())
                .createdAt(company.getCreatedAt())
                .updatedAt(company.getUpdatedAt())
                .build();
    }
}
