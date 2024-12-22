package org.example.auth_server.annotationValidator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.example.auth_server.enums.RoleEnum;

public class RoleEnumAnnotationValidator implements ConstraintValidator<ValidRoleEnum, String> {
    @Override
    public boolean isValid(String roleEnum, ConstraintValidatorContext constraintValidatorContext) {
        if (roleEnum == null) {
            return false;
        }
        try {
            RoleEnum.valueOf(roleEnum);
            return true;
        } catch (IllegalArgumentException ex) {
            return false;
        }
    }
}
