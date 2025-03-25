package org.example.auth_server.dto.match;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class AddMatchRequest {
    @NotBlank
    private String token;
    @NotBlank
    private String teamA;
    @NotBlank
    private String teamB;
    @NotBlank
    private String date;
    @NotBlank
    private String time;
    @NotBlank
    private String stadium;

    private List<SeatsForAddMatchRequest> seats;
}
