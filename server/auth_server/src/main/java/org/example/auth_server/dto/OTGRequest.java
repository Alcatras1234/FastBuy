package org.example.auth_server.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Schema(name = "Проверка одноразового пароля")
public class OTGRequest {
    @Schema(description = "email", example = "kotak@gmail.com")
    @NotBlank(message = "Email can't be empty")
    @Email(message = "Email must be in format user@example.com")
    private String email;

    @Schema(description = "password", example = "351516")
    @NotBlank(message = "Password can't be empty")
    private String password;
}
