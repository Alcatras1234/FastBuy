package org.example.auth_server.dto;

import lombok.Data;

@Data
public class BuyTicketDTO {
    private String token;
    private String count;
    private String bankCard;
    private String cvv;
    private String expiredDate;
}
