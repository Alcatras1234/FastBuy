package org.example.auth_server.dto.match;

import lombok.Data;

@Data
public class SeatsForAddMatchRequest {
    private String sector;
    private Integer row;
    private Integer seatStart;
    private Integer seatEnd;
    private Integer price;
}
