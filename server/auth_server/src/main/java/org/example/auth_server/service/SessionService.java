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

@Service
public class SessionService {
    private final UserRepository userRepository;


    @Autowired
    public SessionService(UserRepository userRepository) {
        this.userRepository = userRepository;
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



}
