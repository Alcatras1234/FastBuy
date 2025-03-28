package org.example.auth_server.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.example.auth_server.service.SessionService;
import org.example.auth_server.utils.JWTUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth_service/token")
@Tag(name = "SessionController", description = "Контроллер для работы с сессиями")
public class SessionController {

    private final SessionService sessionService;

    @Autowired
    public SessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @Operation(summary = "Проверка, валиден ли токен")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Успешный ответ"),
            @ApiResponse(responseCode = "400", description = "Некорректный запрос"),
            @ApiResponse(responseCode = "401", description = "Токен просрочен"),
            @ApiResponse(responseCode = "500", description = "Ошибка сервера")
    })
    @GetMapping("/validate")
    public ResponseEntity<String> validateToken(@RequestParam String tokenRequest) {
        if (!StringUtils.hasText(tokenRequest)) {
            return ResponseEntity.badRequest().body("Токен не может быть пустым");
        }

        if (JWTUtils.validateToken(tokenRequest)) {
            return ResponseEntity.ok("Токен действителен");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Токен не действителен");
        }
    }

    @Operation(summary = "Получение пары токенов по refresh-токену")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Успешный ответ"),
            @ApiResponse(responseCode = "400", description = "Некорректный запрос"),
            @ApiResponse(responseCode = "401", description = "Токен просрочен"),
            @ApiResponse(responseCode = "500", description = "Ошибка сервера")
    })
    @GetMapping("/tokens")
    public ResponseEntity<Map<String, String>> getDataFromToken(@RequestParam(name = "refresh_token") String refreshToken) throws IllegalAccessException {
        return ResponseEntity.ok().body(sessionService.getTokensPair(refreshToken));
    }
}