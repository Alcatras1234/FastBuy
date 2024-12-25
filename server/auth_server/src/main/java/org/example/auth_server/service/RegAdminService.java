package org.example.auth_server.service;

import jakarta.persistence.EntityNotFoundException;

import lombok.extern.log4j.Log4j2;
import org.example.auth_server.dto.RegRequest;
import org.example.auth_server.dto.SendCodeRequest;
import org.example.auth_server.enums.RoleEnum;
import org.example.auth_server.enums.StatusEnum;
import org.example.auth_server.model.User;
import org.example.auth_server.model.ValidatedEmails;
import org.example.auth_server.repository.UserRepository;
import org.example.auth_server.repository.ValidatedEmailsRepository;
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

    private final ValidatedEmailsRepository validatedEmailsRepository;

    @Autowired
    public RegAdminService(PasswordEncoder passwordEncoder, UserRepository userRepository, ValidatedEmailsRepository validatedEmailsRepository) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.validatedEmailsRepository = validatedEmailsRepository;
    }

    @Transactional
    public void registrateUser(RegRequest regRequest) {
        String toAddress = regRequest.getEmail();
        ValidatedEmails validatedEmails = validatedEmailsRepository.findValidatedEmailsByEmail(toAddress);
        if (validatedEmails != null) {
            String hashedPassword = hasherPassword(regRequest.getPassword());
            User user = new User();
            user.setEmail(validatedEmails.getEmail());
            user.setRole(RoleEnum.valueOf(regRequest.getRole()));
            user.setPassword(hashedPassword);
            user.setCreatedDttm(LocalDateTime.now());
            user.setStatus(StatusEnum.ACTIVE);

            userRepository.save(user);
        } else {
            throw new IllegalArgumentException("Email doesnt validated");
        }
    }

    @Transactional(readOnly = true)
    public void userIsExist(SendCodeRequest sendCodeRequest) {
        if (userRepository.existsByEmail(sendCodeRequest.getEmail())) {
            throw new IllegalArgumentException("Пользователь с таким email уже существует");
        }
    }

    private String hasherPassword(String password) {
        return passwordEncoder.encode(password);
    }


}


