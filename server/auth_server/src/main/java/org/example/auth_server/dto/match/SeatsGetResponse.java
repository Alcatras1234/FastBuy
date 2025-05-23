package org.example.auth_server.dto.match;

import lombok.Data;

@Data
public class SeatsGetResponse {
    private String sector;
    private Integer row;
    private String seatNumber;
    private Integer price;
}
