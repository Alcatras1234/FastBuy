package org.example.auth_server.controller;

import org.example.auth_server.service.AuthService;
import org.example.auth_server.service.RegAdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class AdminController {
    private final AuthService authService;

    @Autowired
    public AdminController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/admin/auth")
    public ResponseEntity<String> authAdmin(@RequestParam(name = "login") String login,
                                                         @RequestParam(name = "password") String password) {
        authService.authAdmin(login, password);
        return ResponseEntity.ok("admin авторизован");
    }
}
