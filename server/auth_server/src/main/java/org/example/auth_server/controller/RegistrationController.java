package org.example.auth_server.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.log4j.Log4j2;
import org.example.auth_server.dto.RegRequest;
import org.example.auth_server.service.EmailService;
import org.example.auth_server.service.RegAdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;


@RestController
@Log4j2
@RequestMapping("/api/auth_service")
@Tag(name = "RegistrationController", description = "Controller for user registration")
public class RegistrationController {

    private final RegAdminService regAdminService;

    @Autowired
    public RegistrationController(RegAdminService regAdminService) {
        this.regAdminService = regAdminService;
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

    @Operation(summary = "Users registration")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Bad Request"),
            @ApiResponse(responseCode = "500", description = "Server Error")
    })
    @GetMapping("/valid-email")
    public ResponseEntity<String> validateEmail(@RequestParam(name = "token") String token) throws Exception {

        regAdminService.validateEmail(token);
        return ResponseEntity.ok("email провалидирован!");

    }

    @GetMapping("/email")
    public ResponseEntity<String> checkValidation(@RequestParam(name = "email") String email) {
        regAdminService.checkValidation(email);
        return ResponseEntity.ok("email провалидирован!");

    }


}
