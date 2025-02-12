package org.example.auth_server.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.log4j.Log4j2;
import org.example.auth_server.dto.OTGRequest;
import org.example.auth_server.dto.RegRequest;
import org.example.auth_server.dto.SendCodeRequest;
import org.example.auth_server.service.EmailService;
import org.example.auth_server.service.RegAdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;


@RestController
@Log4j2
@RequestMapping("/api/auth_service")
@Tag(name = "RegistrationController", description = "Controller for user registration")
public class RegistrationController {

    private final RegAdminService regAdminService;
    private final EmailService emailService;

    @Autowired
    public RegistrationController(RegAdminService regAdminService, EmailService emailService) {
        this.regAdminService = regAdminService;
        this.emailService = emailService;
    }


    @Operation(summary = "Users registration")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Bad Request"),
            @ApiResponse(responseCode = "500", description = "Server Error")
    })
    @PostMapping("/registration")
    public ResponseEntity<String> registerUser(@RequestBody @Valid RegRequest regRequest) {
        String uuid = UUID.randomUUID().toString();
        regAdminService.registrateUser(regRequest);
        return ResponseEntity.ok("Провалидируйте email!");
    }



}
