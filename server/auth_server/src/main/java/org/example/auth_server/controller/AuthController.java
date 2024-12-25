package org.example.auth_server.controller;

import jakarta.validation.Valid;
import org.example.auth_server.dto.AuthRequest;
import org.example.auth_server.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth_service")
public class AuthController {
    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/auth")
    public ResponseEntity<Map<String, String>> authUser(@RequestBody @Valid AuthRequest authRequest) {
        Map<String, String> tokens = authService.authUser(authRequest);
        return ResponseEntity.ok(tokens);
    }
}
