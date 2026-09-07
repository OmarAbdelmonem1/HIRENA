package com.hirena.jobseeker.service;

import com.hirena.jobseeker.dto.CertificateRequest;
import com.hirena.jobseeker.dto.CertificateResponse;
import com.hirena.jobseeker.entity.Certificate;
import com.hirena.jobseeker.entity.JobSeeker;
import com.hirena.jobseeker.exception.ResourceNotFoundException;
import com.hirena.jobseeker.repository.CertificateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CertificateService {

    private final CertificateRepository certificateRepository;
    private final JobSeekerService jobSeekerService;

    @Transactional(readOnly = true)
    public List<CertificateResponse> getMyCertificates() {
        JobSeeker jobSeeker = jobSeekerService.getJobSeekerForCurrentUser();
        return certificateRepository.findByJobSeekerId(jobSeeker.getId())
                .stream()
                .map(CertificateResponse::fromEntity)
                .toList();
    }

    public CertificateResponse addCertificate(CertificateRequest request) {
        JobSeeker jobSeeker = jobSeekerService.getJobSeekerForCurrentUser();

        Certificate certificate = Certificate.builder()
                .jobSeeker(jobSeeker)
                .name(request.getName())
                .issuingOrganization(request.getIssuingOrganization())
                .issueDate(request.getIssueDate())
                .expirationDate(request.getExpirationDate())
                .credentialId(request.getCredentialId())
                .credentialUrl(request.getCredentialUrl())
                .build();

        return CertificateResponse.fromEntity(certificateRepository.save(certificate));
    }

    public CertificateResponse updateCertificate(Long certificateId, CertificateRequest request) {
        Certificate certificate = getOwnedCertificateOrThrow(certificateId);

        certificate.setName(request.getName());
        certificate.setIssuingOrganization(request.getIssuingOrganization());
        certificate.setIssueDate(request.getIssueDate());
        certificate.setExpirationDate(request.getExpirationDate());
        certificate.setCredentialId(request.getCredentialId());
        certificate.setCredentialUrl(request.getCredentialUrl());

        return CertificateResponse.fromEntity(certificateRepository.save(certificate));
    }

    public void deleteCertificate(Long certificateId) {
        Certificate certificate = getOwnedCertificateOrThrow(certificateId);
        certificateRepository.delete(certificate);
    }

    private Certificate getOwnedCertificateOrThrow(Long certificateId) {
        JobSeeker jobSeeker = jobSeekerService.getJobSeekerForCurrentUser();
        return certificateRepository.findByIdAndJobSeekerId(certificateId, jobSeeker.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Certificate not found: " + certificateId));
    }
}
