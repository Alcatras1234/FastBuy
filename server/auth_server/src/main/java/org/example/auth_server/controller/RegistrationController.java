package org.example.auth_server.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.log4j.Log4j2;
import org.example.auth_server.dto.reg_auth.RegRequest;
import org.example.auth_server.exeptions.ExpiredJWTException;
import org.example.auth_server.service.RegAdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Path;
import java.nio.file.Paths;

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
        regAdminService.registrateUser(regRequest);
        return ResponseEntity.ok("Провалидируйте email!");
    }

    @Operation(summary = "Validate email")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Bad Request"),
            @ApiResponse(responseCode = "500", description = "Server Error")
    })
    @GetMapping("/valid-email")
    public ResponseEntity<Resource> validateEmail(@RequestParam(name = "token") String token) throws ExpiredJWTException {
        regAdminService.validateEmail(token);
        Path path = Paths.get("src/main/resources/templates/confirmation.html");
        org.springframework.core.io.Resource resource = new FileSystemResource(path);
        return ResponseEntity.ok()
                .contentType(MediaType.TEXT_HTML)
                .body(resource);
    }

    @Operation(summary = "Check email validation")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Bad Request"),
            @ApiResponse(responseCode = "500", description = "Server Error")
    })
    @GetMapping("/email")
    public ResponseEntity<String> checkValidation(@RequestParam(name = "email") String email) {
        regAdminService.checkValidation(email);
        return ResponseEntity.ok("email провалидирован!");
    }
}