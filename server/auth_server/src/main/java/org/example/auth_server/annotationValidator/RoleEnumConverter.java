package org.example.auth_server.annotationValidator;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.example.auth_server.enums.RoleEnum;
import org.example.auth_server.enums.StatusEnum;

@Converter(autoApply = true)
public class RoleEnumConverter implements AttributeConverter<RoleEnum, String> {
    @Override
    public String convertToDatabaseColumn(RoleEnum roleEnum) {
        return roleEnum == null ? null : roleEnum.toString();
    }

    @Override
    public RoleEnum convertToEntityAttribute(String dbData) {
        return dbData == null ? null : RoleEnum.valueOf(dbData.toUpperCase());
    }
}
