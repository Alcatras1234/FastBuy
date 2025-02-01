package org.example.auth_server.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class OrganizatorBankDetailsRequest {

    private Long legalInfoId;
    private String bankName;
    private String routingNumber;
    private String swiftCode;
    private LocalDateTime createdDttm;
    private LocalDateTime updatedDttm;

}
