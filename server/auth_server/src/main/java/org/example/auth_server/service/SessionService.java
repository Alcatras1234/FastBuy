package org.example.auth_server.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.persistence.EntityNotFoundException;
import org.example.auth_server.model.JWTTokens;
import org.example.auth_server.model.User;
import org.example.auth_server.repository.JWTTokensRepository;
import org.example.auth_server.repository.UserRepository;
import org.example.auth_server.utils.JWTUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SessionService {
    private final JWTTokensRepository sessionRepository;
    private final UserRepository userRepository;


    @Autowired
    public SessionService(JWTTokensRepository sessionRepository, UserRepository userRepository) {
        this.sessionRepository = sessionRepository;
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

    @Transactional
    public String refreshAccessToken(String refreshToken) {
        if (JWTUtils.validateToken(refreshToken)) {

            JWTTokens session = sessionRepository.findJWTTokensByRefreshToken(refreshToken);

            String email = getEmailFromRefreshToken(session.getRefreshToken());
            User user = findUserByEmail(email);
            if (user == null)
                throw new EntityNotFoundException("User with email " + email + " not found");
            String accessToken = JWTUtils.generateAccessToken(user);


            session.setAccessToken(accessToken);

            sessionRepository.save(session);

            return accessToken;
        } else {
            throw new JwtException("Авторизуйтесь снова, refresh токен истек");
        }

    }

    @Transactional
    protected User findUserByEmail(String email) {
        return userRepository.findUserByEmail(email);
    }


}
