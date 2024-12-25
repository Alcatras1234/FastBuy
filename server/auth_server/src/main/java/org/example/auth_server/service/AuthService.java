package org.example.auth_server.service;

import jakarta.persistence.EntityNotFoundException;

import org.example.auth_server.dto.AuthRequest;
import org.example.auth_server.model.JWTTokens;
import org.example.auth_server.model.User;
import org.example.auth_server.repository.JWTTokensRepository;
import org.example.auth_server.repository.UserRepository;
import org.example.auth_server.utils.JWTUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordencoder;

    private final JWTTokensRepository jwtTokensRepository;



    @Autowired
    public AuthService(UserRepository userRepository, PasswordEncoder passwordencoder, JWTTokensRepository jwtTokensRepository) {
        this.userRepository = userRepository;
        this.passwordencoder = passwordencoder;
        this.jwtTokensRepository = jwtTokensRepository;
    }

    @Transactional
    public Map<String, String> authUser(AuthRequest authRequest) {
        User user = getUser(authRequest.getEmail());
        checkPassword(authRequest.getPassword(), user);

        String accessToken = JWTUtils.generateAccessToken(user);
        String refreshToken = JWTUtils.generateRefreshToken(user);

        Map<String, String> tokens = new HashMap<>();
        tokens.put("refreshToken", refreshToken);
        tokens.put("accessToken", accessToken);

        JWTTokens jwtTokens = new JWTTokens();
        jwtTokens.setAccessToken(accessToken);
        jwtTokens.setRefreshToken(refreshToken);

        jwtTokensRepository.save(jwtTokens);
        return tokens;
    }

    @Transactional(readOnly = true)
    protected User getUser(String email) {
        User user = userRepository.findUserByEmail(email);
        if (user == null) {
            throw new EntityNotFoundException("Пользователь не существует");
        }
        return user;
    }

    private void checkPassword(String password, User user) {
        if (!passwordencoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("Password are not same");
        }
    }
}
