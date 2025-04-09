package org.example.auth_server.dto.match;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ReturnTicketRequest {
    @NotBlank
    private String token;
    @Schema(description = "Id билета, который записан в бд")
    private Long id;
}
