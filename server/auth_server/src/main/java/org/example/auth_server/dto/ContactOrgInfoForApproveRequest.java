package org.example.auth_server.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Schema(description = "Запрос на подтверждение организатора")
public class ContactOrgInfoForApproveRequest {
    @NotBlank(message =  "Email не может быть пустым")
    private String email;
}
