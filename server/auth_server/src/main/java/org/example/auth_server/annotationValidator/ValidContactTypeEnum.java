package org.example.auth_server.annotationValidator;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = RoleEnumAnnotationValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidContactTypeEnum {
    String message() default "Invalid contact type";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
