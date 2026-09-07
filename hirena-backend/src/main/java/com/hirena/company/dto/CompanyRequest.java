package com.hirena.company.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CompanyRequest {

    @NotBlank(message = "Company name is required")
    @Size(max = 255, message = "Company name must not exceed 255 characters")
    private String companyName;

    @Size(max = 5000, message = "Description must not exceed 5000 characters")
    private String description;

    private String industry;
    private String companyPhone;
    private String website;
    private String address;
    private String city;
    private String country;
    private Integer foundedYear;
    private String companySize;
    private String logo;
}
