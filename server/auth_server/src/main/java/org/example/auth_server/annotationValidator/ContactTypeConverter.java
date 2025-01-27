package org.example.auth_server.annotationValidator;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.example.auth_server.enums.ContactTypeEnum;

@Converter(autoApply = true)
public class ContactTypeConverter implements AttributeConverter<ContactTypeEnum, String> {

    @Override
    public String convertToDatabaseColumn(ContactTypeEnum contactTypeEnum) {
        return contactTypeEnum == null ? null : contactTypeEnum.toString();
    }

    @Override
    public ContactTypeEnum convertToEntityAttribute(String dbData) {
        return dbData == null ? null : ContactTypeEnum.valueOf(dbData.toUpperCase());
    }
}
