package com.hirena.company.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class IndustryConverter implements AttributeConverter<Industry, String> {

    @Override
    public String convertToDatabaseColumn(Industry industry) {
        return industry == null ? null : industry.getLabel();
    }

    @Override
    public Industry convertToEntityAttribute(String value) {
        return value == null || value.isBlank() ? null : Industry.fromValue(value);
    }
}
