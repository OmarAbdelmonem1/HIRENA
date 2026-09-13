package com.hirena.company.service;

import com.hirena.auth.security.CurrentUserProvider;
import com.hirena.company.dto.CompanyRequest;
import com.hirena.company.dto.CompanyResponse;
import com.hirena.company.entity.Company;
import com.hirena.company.repository.CompanyRepository;
import com.hirena.exception.BadRequestException;
import com.hirena.exception.ResourceNotFoundException;
import com.hirena.user.entity.User;
import com.hirena.jobseeker.util.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import java.net.InetAddress;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.io.IOException;
import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.Map;
@Service
@RequiredArgsConstructor
@Transactional
public class CompanyService {

    private static final HttpClient HTTP_CLIENT = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(5))
            .followRedirects(HttpClient.Redirect.NORMAL)
            .build();
    private static final int MAX_DOWNLOAD_BYTES = 5 * 1024 * 1024;

    private final CompanyRepository companyRepository;
    private final CurrentUserProvider currentUserProvider;
    private final FileStorageService fileStorageService;
    @Transactional(readOnly = true)
    public CompanyResponse getCompanyById(Long id) {
        return CompanyResponse.fromEntity(companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Company profile not found for id: " + id)));
    }
    public CompanyResponse createProfile(CompanyRequest request) {
        User currentUser = currentUserProvider.getCurrentUser();

        if (companyRepository.existsByUserId(currentUser.getId())) {
            throw new BadRequestException("A company profile already exists for this account");
        }
          

        Company company = Company.builder()
                .user(currentUser)
                .companyName(request.getCompanyName())
                .description(request.getDescription())
                .industry(request.getIndustry())
                .companyPhone(request.getCompanyPhone())
                .website(request.getWebsite())
                .address(request.getAddress())
                .city(request.getCity())
                .country(request.getCountry())
                .foundedYear(request.getFoundedYear())
                .companySize(request.getCompanySize())
                .logo(request.getLogo())
                .build();

        return CompanyResponse.fromEntity(companyRepository.save(company));
    }

    @Transactional(readOnly = true)
    public CompanyResponse getMyProfile() {
        return CompanyResponse.fromEntity(getCompanyForCurrentUser());
    }

    @Transactional(readOnly = true)
    public Page<CompanyResponse> getPublicCompanies(String keyword, String industry, Pageable pageable) {
        Specification<Company> specification = (root, query, cb) -> {
            var predicate = cb.conjunction();
            if (keyword != null && !keyword.isBlank()) {
                String pattern = "%" + keyword.trim().toLowerCase() + "%";
                predicate = cb.and(predicate, cb.like(cb.lower(root.get("companyName")), pattern));
            }
            if (industry != null && !industry.isBlank()) {
                predicate = cb.and(predicate, cb.equal(cb.lower(root.get("industry")), industry.trim().toLowerCase()));
            }
            return predicate;
        };
        return companyRepository.findAll(specification, pageable).map(CompanyResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public CompanyResponse getPublicCompany(Long id) {
        return companyRepository.findById(id)
                .map(CompanyResponse::fromEntity)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found"));
    }

    public CompanyResponse updateProfile(CompanyRequest request) {
        Company company = getCompanyForCurrentUser();

        company.setCompanyName(request.getCompanyName());
        company.setDescription(request.getDescription());
        company.setIndustry(request.getIndustry());
        company.setCompanyPhone(request.getCompanyPhone());
        company.setWebsite(request.getWebsite());
        company.setAddress(request.getAddress());
        company.setCity(request.getCity());
        company.setCountry(request.getCountry());
        company.setFoundedYear(request.getFoundedYear());
        company.setCompanySize(request.getCompanySize());
        company.setLogo(request.getLogo());

        return CompanyResponse.fromEntity(companyRepository.save(company));
    }

    public void deleteProfile() {
        Company company = getCompanyForCurrentUser();
        fileStorageService.deleteCompanyLogo(company.getLogo());
        companyRepository.delete(company);
    }


    /**
     * Resolves the Company that belongs to the currently authenticated user.
     * Identity is derived from the JWT via SecurityContext – never from a client-supplied id.
     */
    @Transactional(readOnly = true)
    public Company getCompanyForCurrentUser() {
        Long userId = currentUserProvider.getCurrentUserId();
        return companyRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Company profile not found. Create a company profile first."));
    }
}
