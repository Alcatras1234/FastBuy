package org.example.auth_server.service;

import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import jakarta.persistence.EntityNotFoundException;

import lombok.extern.log4j.Log4j2;
import org.example.auth_server.dto.OTGRequest;
import org.example.auth_server.utils.JWTUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Properties;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

@Log4j2
@Service
public class EmailService {
    private final String STRINGWITHNUMBERS = "0123456789";
    private final int PASSWORDLENGTH = 6;
    private final SecureRandom random = new SecureRandom();
    @Value("${from.email}")
    private String from;

    @Value("${password.gmail}")
    private String password;
    private Properties properties;
    private Session session;

    private final ExecutorService executorService = Executors.newFixedThreadPool(10);


    @Async
    public void sendEmailForVerify(String email) {
        String host = "smtp.gmail.com";
        String validateToken = JWTUtils.generateValidateToken(email);
        String link = "http://45.150.4.240:8080/api/auth_service/valid-email?token=" + validateToken;

        properties = System.getProperties();
        properties.put("mail.smtp.host", host);
        properties.put("mail.smtp.port", "587");
        properties.put("mail.smtp.auth", "true");
        properties.put("mail.smtp.starttls.enable", "true");
        properties.put("mail.smtp.ssl.trust", "smtp.gmail.com");

        session = Session.getInstance(properties, new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(from, password);
            }
        });

        try {
            MimeMessage message = new MimeMessage(session);

            message.setFrom(new InternetAddress(from));
            message.addRecipients(Message.RecipientType.TO, String.valueOf(new InternetAddress(email)));

            message.setSubject("Validate");

            message.setText(link);

            Transport.send(message);
            log.info("Email are sended");


        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
    }

    private boolean equalsPassword(String databasePassword, String enteredPassword) {
        return Objects.equals(databasePassword, enteredPassword);
    }


}
