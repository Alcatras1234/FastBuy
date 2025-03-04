package org.example.auth_server.service;

import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

import lombok.extern.log4j.Log4j2;
import org.example.auth_server.utils.JWTUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Objects;
import java.util.Properties;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Log4j2
@Service
public class EmailService {
    private final String STRINGWITHNUMBERS = "0123456789";
    private final int PASSWORDLENGTH = 6;
    private final SecureRandom random = new SecureRandom();
    @Value("${from.email}")
    private String from;

    @Value("${password.email}")
    private String password;
    private Properties properties;
    private Session session;

    @Async
    public void sendEmailForVerify(String email) throws MessagingException {
        log.info("Начинаю отправку email");
        String host = "smtp.yandex.ru";
        String validateToken = JWTUtils.generateValidateToken(email);
        String link = "http://193.187.172.248/valid-email/?token=" + validateToken;


        properties = System.getProperties();
        properties.put("mail.smtp.host", host);
        properties.put("mail.smtp.port", "587"); // Порт для SSL
        properties.put("mail.smtp.auth", "true");
        properties.put("mail.smtp.ssl.enable", "true"); // Включить SSL
        properties.put("mail.smtp.ssl.trust", host); // Доверять этому хосту

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
            e.printStackTrace();
            throw new MessagingException(e.getMessage());
        }
    }

    private boolean equalsPassword(String databasePassword, String enteredPassword) {
        return Objects.equals(databasePassword, enteredPassword);
    }


}
