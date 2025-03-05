package org.example.auth_server.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.persistence.EntityNotFoundException;
import org.example.auth_server.model.User;
import org.example.auth_server.repository.UserRepository;
import org.example.auth_server.utils.JWTUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
public class SessionService {
    private final UserRepository userRepository;
    private final UserWorkService userWorkService;


    @Autowired
    public SessionService(UserRepository userRepository, UserWorkService userWorkService) {
        this.userRepository = userRepository;
        this.userWorkService = userWorkService;
    }


    public String getRoleFromAccessToken(String token) {

        try {
            Claims claims = JWTUtils.extractClaim(token);
            return claims.get("role", String.class);
        } catch (JwtException e) {
            throw new JwtException("Невалидный токен или ошибка при его обработке");
        }
    }

    public String getEmailFromRefreshToken(String token) {

        try {
            Claims claims = JWTUtils.extractClaim(token);
            return claims.get("email", String.class);
        } catch (JwtException e) {
            throw new JwtException("Невалидный токен или ошибка при его обработке");
        }
    }

    public Map<String, String> getTokensPair(String refreshToken) throws IllegalAccessException {
        if (!JWTUtils.validateToken(refreshToken)) {
            throw new IllegalAccessException("Авторизуйтесь снова");
        }

        Claims claims = JWTUtils.extractClaim(refreshToken);

        User user = userWorkService.getUser((String) claims.get("email"));

        String accessToken = JWTUtils.generateAccessToken(user);
        String refreshedToken = JWTUtils.generateRefreshToken(user);

        Map<String, String> tokensPair = new HashMap<>();
        tokensPair.put("access_token", accessToken);
        tokensPair.put("refresh_token", refreshedToken);
        tokensPair.put("role", user.getRole().toString());
        return tokensPair;

    }



}
