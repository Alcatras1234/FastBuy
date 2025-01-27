package org.example.auth_server.annotationValidator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.example.auth_server.enums.RoleEnum;

public class ContactTypeEnumValidator implements ConstraintValidator<ValidContactTypeEnum, String> {
    @Override
    public boolean isValid(String s, ConstraintValidatorContext constraintValidatorContext) {
        if (s == null) {
            return false;
        }
        try {
            RoleEnum.valueOf(s);
            return true;
        } catch (IllegalArgumentException ex) {
            return false;
        }
    }
}
