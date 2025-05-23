package org.example.auth_server.dto.match;

import lombok.Data;

@Data
public class BuyTicketRequest {
    private String token;
    private String seatNumber;
    private String bankCard;
    private String cvv;
    private String expireDate;
}
