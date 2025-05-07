package org.example.auth_server.model.match;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.example.auth_server.model.match.Match.Status;

@Converter(autoApply = true)
public class StatusConverter implements AttributeConverter<Status, String> {

    @Override
    public String convertToDatabaseColumn(Status status) {
        if (status == null) return null;
        return status.getDbValue();
    }

    @Override
    public Status convertToEntityAttribute(String dbValue) {
        if (dbValue == null) return null;
        return Status.fromDbValue(dbValue);
    }
}