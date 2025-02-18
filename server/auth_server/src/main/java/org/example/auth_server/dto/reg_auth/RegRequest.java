package org.example.auth_server.dto.reg_auth;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.example.auth_server.annotationValidator.ValidRoleEnum;

@Data
@Schema(description = "Регистрация пользователя в системе")
public class RegRequest {

    @Schema(description = "email", example = "kotak@gmail.com")
    @NotBlank(message = "Email can't be empty")
    @Email(message = "Email must be in format user@example.com")
    private String email;

    @Schema(description = "password", example = "am@gus778sp")
    @Size(min = 8, max = 255, message = "Password must have from 8 to 255 symbols")
    @NotBlank(message = "Password can't be empty")
    private String password;

    @Schema(description = "role", example = "ADMIN")
    @NotBlank(message = "Role can't be empty")
    @ValidRoleEnum(message = "Role is not available")
    private String role;
}
