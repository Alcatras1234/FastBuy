package org.example.auth_server.dto.organizator;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Schema(description = "Запрос на обновление данных организатора")
public class OrganizatorUpdateDataRequest {

    @NotBlank
    private String token;
    @NotBlank
    private String companyName;
    @NotBlank
    private String contactPhone;
    @NotBlank
    private String bankAccount;
}
