package org.example.auth_server.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.example.auth_server.annotationValidator.ValidContactTypeEnum;

@Data
@Schema(description = "Заполнение контактных данных об организаторе")
public class ContactOrganizatorInfoRequest {

    @NotBlank(message = "id пользователя не может быть пустым")
    private Long userId;
    @NotBlank(message = "Названии компании пользователя не может быть пустым")
    private String companyName;
    @NotBlank(message = "Регистрационный номер пользователя не может быть пустым")
    private String registrationNumber;
    @NotBlank(message = "TaxId пользователя не может быть пустым")
    private String taxId;
    @NotBlank(message = "Легальный адресс пользователя не может быть пустым")
    private String legalAdress;
    @NotBlank(message = "PostalCode пользователя не может быть пустым")
    private String postalCode;
    @NotBlank(message = "ContactType пользователя не может быть пустым")
    @ValidContactTypeEnum
    private String contactType;
    @NotBlank(message = "id пользователя не может быть пустым")
    private String contactValue;
}
