package com.hirena.jobseeker.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CertificateRequest {

    @NotBlank(message = "Certificate name is required")
    private String name;

    private String issuingOrganization;

    private LocalDate issueDate;

    private LocalDate expirationDate;

    private String credentialId;

    private String credentialUrl;
}
