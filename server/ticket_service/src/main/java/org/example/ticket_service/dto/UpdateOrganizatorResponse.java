package org.example.ticket_service.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Schema(description = "Обновление данных о организаторе")
public class UpdateOrganizatorResponse {
    @Schema(description = "accessToken")
    @NotBlank(message = "Токен не может быть пустым")
    private String accessToken;

    public String getAccessToken() {
        return accessToken;
    }
}
