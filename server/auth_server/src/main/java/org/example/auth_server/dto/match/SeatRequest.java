package org.example.auth_server.dto.match;

import lombok.Data;

@Data
public class SeatRequest {
    private String seatNumber;
    private String row;
    private String sector;
}
