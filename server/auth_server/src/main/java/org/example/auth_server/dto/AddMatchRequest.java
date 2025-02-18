package org.example.auth_server.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

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

    private Integer tickets;
  
    private Integer ticketPrice;
}
