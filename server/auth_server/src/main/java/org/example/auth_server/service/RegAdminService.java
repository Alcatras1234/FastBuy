package org.example.auth_server.service;

import lombok.extern.log4j.Log4j2;
import org.example.auth_server.dto.RegRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Log4j2
@Service
public class RegAdminService {
    // TODO: Добавить метод для проверки валидности имейла, отпарвляя на почту код или ссылку с подтверждением!
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public RegAdminService(EmailService emailService, PasswordEncoder passwordEncoder) {
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
    }

    private String hasherPassword(String password) {
        return passwordEncoder.encode(password);
    }

    public void registrateUser(RegRequest regRequest) {
        String fromAddress = regRequest.getEmail();

        emailService.sendEmailForVerify(fromAddress);


    }

}


