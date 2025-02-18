package org.example.auth_server.service;

import jakarta.persistence.EntityNotFoundException;

import org.example.auth_server.dto.reg_auth.AuthRequest;
import org.example.auth_server.model.Admin;
import org.example.auth_server.model.User;
import org.example.auth_server.repository.AdminRepository;
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
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordencoder;

    @Autowired
    public AuthService(UserRepository userRepository, AdminRepository adminRepository, PasswordEncoder passwordencoder) {
        this.userRepository = userRepository;
        this.adminRepository = adminRepository;
        this.passwordencoder = passwordencoder;
    }

    @Transactional(readOnly = true)
    public void authAdmin(String login, String password) {
        Admin admin = adminRepository.findAdminByLogin(login).orElseThrow(() -> {
            throw new EntityNotFoundException("Админ не найден");
        });

        if (admin.getPassword() != password) {
            throw new IllegalArgumentException("Пароли не совпадают");
        }
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

        return tokens;
    }

    @Transactional(readOnly = true)
    protected User getUser(String email) {
        User user = userRepository.findUserByEmail(email).get();
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
