//package org.example.auth_server.controller;
//
//import io.swagger.v3.oas.annotations.Operation;
//import io.swagger.v3.oas.annotations.responses.ApiResponse;
//import io.swagger.v3.oas.annotations.responses.ApiResponses;
//import io.swagger.v3.oas.annotations.tags.Tag;
//import jakarta.validation.Valid;
//import org.example.auth_server.service.SessionService;
//import org.example.auth_server.utils.JWTUtils;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.util.StringUtils;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/token/")
//@Tag(name = "SessionController", description = "Контроллер для работы с сессиями")
//public class SessionController {
//
//    private final SessionService sessionService;
//
//    @Autowired
//    public SessionController(SessionService sessionService) {
//        this.sessionService = sessionService;
//    }
//
//    @Operation(summary = "Обновить access токен")
//    @ApiResponses(value = {
//            @ApiResponse(responseCode = "200", description = "Успешный ответ"),
//            @ApiResponse(responseCode = "400", description = "Некорректный запрос"),
//            @ApiResponse(responseCode = "401", description = "Токен просрочен"),
//            @ApiResponse(responseCode = "500", description = "Ошибка сервера")
//    })
//    @PutMapping("/refresh")
//    public ResponseEntity<String> refreshAccessToken(@Valid @RequestBody TokenRequest tokenRequest) {
//        String accessToken = sessionService.refreshAccessToken(tokenRequest.getToken());
//        return ResponseEntity.ok(accessToken);
//
//    }
//
//    @Operation(summary = "Проверка, валиден ли токен")
//    @ApiResponses(value = {
//            @ApiResponse(responseCode = "200", description = "Успешный ответ"),
//            @ApiResponse(responseCode = "400", description = "Некорректный запрос"),
//            @ApiResponse(responseCode = "401", description = "Токен просрочен"),
//            @ApiResponse(responseCode = "500", description = "Ошибка сервера")
//    })
//    @GetMapping("/validate")
//    public ResponseEntity<String> validateToken(@RequestParam String tokenRequest) {
//        if (!StringUtils.hasText(tokenRequest)) {
//            return ResponseEntity.badRequest().body("Токен не может быть пустым");
//        }
//
//        if (JWTUtils.validateToken(tokenRequest)) {
//            return ResponseEntity.ok("Токен действителен");
//        } else {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Токен не действителен");
//        }
//    }
//
//    @Operation(summary = "Получение роли из access токена")
//    @ApiResponses(value = {
//            @ApiResponse(responseCode = "200", description = "Успешный ответ"),
//            @ApiResponse(responseCode = "400", description = "Некорректный запрос"),
//            @ApiResponse(responseCode = "500", description = "Ошибка сервера")
//    })
//    @GetMapping("/getdata")
//    public ResponseEntity<String> getDataFromToken(@RequestParam String token) {
//        if (!StringUtils.hasText(token)) {
//            return ResponseEntity.badRequest().body("Токен не может быть пустым");
//        }
//        String userData = sessionService.getDataFromAccessToken(token);
//        return ResponseEntity.ok(userData);
//    }
//}
