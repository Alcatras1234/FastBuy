package org.example.auth_server.service;

import io.jsonwebtoken.Claims;
import jakarta.persistence.EntityExistsException;
import lombok.extern.log4j.Log4j2;
import org.example.auth_server.dto.reg_auth.RegRequest;
import org.example.auth_server.enums.RoleEnum;
import org.example.auth_server.enums.StatusEnum;
import org.example.auth_server.exeptions.ExpiredJWTException;
import org.example.auth_server.model.User;
import org.example.auth_server.repository.UserRepository;
import org.example.auth_server.utils.JWTUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;

@Log4j2
@Service
public class RegAdminService {
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    private final EmailService emailService;

    private final RedisTemplate redisTemplate;

    @Autowired
    public RegAdminService(PasswordEncoder passwordEncoder, UserRepository userRepository, EmailService emailService, RedisTemplate redisTemplate) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.redisTemplate = redisTemplate;
    }

    @Transactional
    public void registrateUser(RegRequest regRequest) {
        String toAddress = regRequest.getEmail();
        String hashedPassword = hasherPassword(regRequest.getPassword());
        userRepository.findUserByEmail(regRequest.getEmail()).ifPresent(
                user -> {
                    log.error("Пользователь уже зарегестрирован");
                    throw new EntityExistsException("Пользователь существует!");
                }
        );


        User user = new User();
        emailService.sendEmailForVerify(toAddress);

        user.setEmail(regRequest.getEmail());
        user.setRole(RoleEnum.valueOf(regRequest.getRole()));
        user.setPassword(hashedPassword);
        user.setCreatedDttm(LocalDateTime.now());
        user.setStatus(StatusEnum.ACTIVE);
        String key = "user:" + user.getEmail();
        redisTemplate.opsForValue().set(key, user, Duration.ofMinutes(10));
        log.info("Пользователь " + user);

        userRepository.save(user);
    }


@Transactional
public void validateEmail(String token) throws ExpiredJWTException {
    log.info("Старт валидации имейла");
    if (!JWTUtils.validateToken(token)) {
        log.error("Токен не валиден!");
        throw new ExpiredJWTException("Токен не валиден");
    }
    Claims claims = JWTUtils.extractClaim(token);
    String email = claims.getSubject();
    User user = userRepository.findUserByEmail(email).get();
    user.setVerify(true);
    userRepository.save(user);
    log.info("Статус пользователя изменен на " + user.isVerify());
}

@Transactional(readOnly = true)
public void checkValidation(String email) {
    User user = userRepository.findUserByEmail(email).get();
    log.info("Пользователь для валидации " + user.toString());
    if (!user.isVerify()) {
        throw new IllegalStateException("почта не провалидирована " + user.toString());
    }
}


private String hasherPassword(String password) {
    return passwordEncoder.encode(password);
}


}


