package com.hirena.jobseeker.dto;

import com.hirena.jobseeker.entity.Certificate;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CertificateResponse {

    private Long id;
    private String name;
    private String issuingOrganization;
    private LocalDate issueDate;
    private LocalDate expirationDate;
    private String credentialId;
    private String credentialUrl;

    public static CertificateResponse fromEntity(Certificate c) {
        return CertificateResponse.builder()
                .id(c.getId())
                .name(c.getName())
                .issuingOrganization(c.getIssuingOrganization())
                .issueDate(c.getIssueDate())
                .expirationDate(c.getExpirationDate())
                .credentialId(c.getCredentialId())
                .credentialUrl(c.getCredentialUrl())
                .build();
    }
}
