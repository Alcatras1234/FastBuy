package org.example.auth_server.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.example.auth_server.model.Match;
import org.example.auth_server.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Operation(summary = "Get matches for user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Matches retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "500", description = "Server error")
    })
    @GetMapping("/match")
    public ResponseEntity<List<Match>> getMatchesForUser(@RequestParam(name = "page", defaultValue = "0") Integer page,
                                                         @RequestParam(name = "count", defaultValue = "10") Integer count,
                                                         @RequestParam(name = "access_token") String accessToken) {
        return ResponseEntity.ok().body(userService.getMatchForUser(accessToken, page, count));
    }
}