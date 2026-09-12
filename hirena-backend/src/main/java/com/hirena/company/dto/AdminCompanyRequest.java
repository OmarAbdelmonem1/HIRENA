package com.hirena.company.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * Request used by administrators to create or update a company profile.
 */
@Getter
@Setter
public class AdminCompanyRequest extends CompanyRequest {

    private Long userId;
}
