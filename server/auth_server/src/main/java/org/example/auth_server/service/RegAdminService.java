package org.example.auth_server.service;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Service
public class RegAdminService {
    // TODO: Добавить метод для проверки валидности имейла, отпарвляя на почту код или ссылку с подтверждением!
    private final String STRINGWITHNUMBERS = "0123456789";
    private final int PASSWORDLENGTH = 6;
    private final SecureRandom random = new SecureRandom();

    private String OTPGenerator() {
        StringBuffer password = new StringBuffer();
        for (int i = 0; i < PASSWORDLENGTH; i++) {
            password.append(STRINGWITHNUMBERS.charAt(random.nextInt(STRINGWITHNUMBERS.length())));
        }
        return password.toString();
    }




}


