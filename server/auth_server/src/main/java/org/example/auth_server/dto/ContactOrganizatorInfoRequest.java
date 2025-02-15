package org.example.auth_server.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Schema(description = "Заполнение контактных данных об организаторе")
public class ContactOrganizatorInfoRequest {

    @NotBlank(message =  "Email не может быть пустым")
    private String email;
    @NotBlank(message = "Названии компании пользователя не может быть пустым")
    private String companyName;
    @NotBlank(message = "Номер пользователя не может быть пустым")
    private String contactNumber;
}
