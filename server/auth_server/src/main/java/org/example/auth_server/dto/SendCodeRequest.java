package org.example.auth_server.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Schema(name = "Отправка одноразового пароля")
public class SendCodeRequest {
    @Schema(description = "email", example = "kotak@gmail.com")
    @NotBlank(message = "Email can't be empty")
    @Email(message = "Email must be in format user@example.com")
    private String email;
}
