package org.example.auth_server.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import lombok.extern.log4j.Log4j2;
import org.example.auth_server.dto.RegRequest;
import org.example.auth_server.enums.RoleEnum;
import org.example.auth_server.enums.StatusEnum;
import org.example.auth_server.model.User;
import org.example.auth_server.repository.UserRepository;
import org.example.auth_server.utils.JWTUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Log4j2
@Service
public class RegAdminService {
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    private final EmailService emailService;
    @Autowired
    public RegAdminService(PasswordEncoder passwordEncoder, UserRepository userRepository, EmailService emailService) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    @Transactional
    public void registrateUser(RegRequest regRequest, String uuid) {
        String toAddress = regRequest.getEmail();
        String hashedPassword = hasherPassword(regRequest.getPassword());
        emailService.sendEmailForVerify(regRequest.getEmail(), uuid);
        User user = new User();
        user.setEmail(regRequest.getEmail());
        user.setRole(RoleEnum.valueOf(regRequest.getRole()));
        user.setPassword(hashedPassword);
        user.setCreatedDttm(LocalDateTime.now());
        user.setStatus(StatusEnum.ACTIVE);

        userRepository.save(user);

    }

    @Transactional
    public void validateEmail(String token) throws Exception{
        if (!JWTUtils.validateToken(token)) {
            throw new JwtException("Токен не валиден");
        }
        Claims claims = JWTUtils.extractClaim(token);
        String email = claims.getSubject();
        User user = userRepository.findUserByEmail(email);
        user.setVerify(true);
        userRepository.save(user);
    }


    private String hasherPassword(String password) {
        return passwordEncoder.encode(password);
    }


}


