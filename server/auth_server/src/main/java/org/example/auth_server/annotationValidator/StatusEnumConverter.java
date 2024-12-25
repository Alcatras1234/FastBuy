package org.example.auth_server.annotationValidator;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.example.auth_server.enums.StatusEnum;

@Converter(autoApply = true)
public class StatusEnumConverter implements AttributeConverter<StatusEnum, String> {

    @Override
    public String convertToDatabaseColumn(StatusEnum statusEnum) {
        return statusEnum == null ? null : statusEnum.toString();
    }

    @Override
    public StatusEnum convertToEntityAttribute(String dbData) {
        return dbData == null ? null : StatusEnum.valueOf(dbData.toUpperCase());
    }
}
