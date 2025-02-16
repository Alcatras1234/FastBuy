package org.example.auth_server.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Schema(name = "Запрос на удаление организатора из допустимых")
public class UnprovenOrganizationRequest {
    @Schema(description = "id", example = "0")
    @NotBlank(message = "can't be empty")
    private String id;
}
