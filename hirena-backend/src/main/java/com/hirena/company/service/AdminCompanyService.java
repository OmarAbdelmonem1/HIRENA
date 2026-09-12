package com.hirena.company.service;

import com.hirena.company.dto.AdminCompanyRequest;
import com.hirena.company.dto.CompanyResponse;
import com.hirena.company.entity.Company;
import com.hirena.company.repository.CompanyRepository;
import com.hirena.exception.BadRequestException;
import com.hirena.exception.ResourceNotFoundException;
import com.hirena.user.entity.User;
import com.hirena.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminCompanyService {

    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public Page<CompanyResponse> getAllCompanies(Pageable pageable) {
        return companyRepository.findAll(pageable).map(CompanyResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public CompanyResponse getCompanyById(Long id) {
        return CompanyResponse.fromEntity(findCompany(id));
    }

    public CompanyResponse createCompany(AdminCompanyRequest request) {
        if (request.getUserId() == null) {
            throw new BadRequestException("User id is required");
        }

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (companyRepository.existsByUserId(user.getId())) {
            throw new BadRequestException("A company profile already exists for this user");
        }

        Company company = new Company();
        company.setUser(user);
        applyCompanyFields(company, request);
        return CompanyResponse.fromEntity(companyRepository.save(company));
    }

    public CompanyResponse updateCompany(Long id, AdminCompanyRequest request) {
        Company company = findCompany(id);
        applyCompanyFields(company, request);
        return CompanyResponse.fromEntity(companyRepository.save(company));
    }

    public void deleteCompany(Long id) {
        companyRepository.delete(findCompany(id));
    }

    private Company findCompany(Long id) {
        return companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found"));
    }

    private void applyCompanyFields(Company company, AdminCompanyRequest request) {
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
    }
}
