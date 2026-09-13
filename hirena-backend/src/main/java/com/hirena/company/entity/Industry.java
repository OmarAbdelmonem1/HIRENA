package com.hirena.company.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Arrays;

public enum Industry {
    INFORMATION_TECHNOLOGY("Information Technology"),
    FINANCIAL_SERVICES("Financial Services"),
    TELECOMMUNICATIONS("Telecommunications"),
    MEDIA_ADVERTISING("Media & Advertising"),
    MANUFACTURING("Manufacturing"),
    E_COMMERCE("E-commerce"),
    LOGISTICS_TRANSPORT("Logistics & Transport"),
    LOGISTICS_SUPPLY_CHAIN("Logistics & Supply Chain"),
    HEALTHCARE("Healthcare"),
    ENERGY("Energy"),
    AUTOMOTIVE("Automotive"),
    EDUCATION("Education"),
    HOSPITALITY("Hospitality"),
    AGRICULTURE("Agriculture"),
    FINANCE("Finance"),
    CONSTRUCTION("Construction"),
    REAL_ESTATE("Real Estate"),
    RETAIL("Retail"),
    MEDIA_ENTERTAINMENT("Media & Entertainment");

    private final String label;

    Industry(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }

    @JsonCreator
    public static Industry fromValue(String value) {
        return Arrays.stream(values())
                .filter(industry -> industry.name().equalsIgnoreCase(value)
                        || industry.label.equalsIgnoreCase(value))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Unsupported industry: " + value));
    }
}
