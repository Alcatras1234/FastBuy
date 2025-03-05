package org.example.auth_server.service;

import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.log4j.Log4j2;
import org.example.auth_server.AuthServiceConfig;
import org.example.auth_server.utils.JWTUtils;
import org.springframework.stereotype.Service;

import java.util.Properties;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Log4j2
@Service
public class EmailService {
    private final String from;
    private final String password;
    private Properties properties;
    private Session session;

    public EmailService(AuthServiceConfig config) {
        this.from = config.getGmail();
        this.password = config.getPassword();
    }

    private final ExecutorService executorService = Executors.newFixedThreadPool(10);

    public void sendEmailForVerify(String email) {
        executorService.submit(() -> {
            log.info("Sending email from " + from);
            log.info("Sending password " + password);
            String host = "smtp.gmail.com";
            String validateToken = JWTUtils.generateValidateToken(email);
            String link = "http://localhost:8080/valid-email/?token=" + validateToken;

            properties = new Properties();
            properties.put("mail.debug", "true");
            properties.put("mail.smtp.host", host);
            properties.put("mail.smtp.port", "587");
            properties.put("mail.smtp.auth", "true");
            properties.put("mail.smtp.starttls.enable", "true");
            properties.put("mail.smtp.starttls.required", "true");
            properties.put("mail.smtp.ssl.trust", "smtp.gmail.com");

            session = Session.getInstance(properties, new Authenticator() {
                protected PasswordAuthentication getPasswordAuthentication() {
                    return new PasswordAuthentication(from, password);
                }
            });
            session.setDebug(true);
            try {
                log.info(session.getProperties());
                MimeMessage message = new MimeMessage(session);
                message.setFrom(new InternetAddress(from));
                message.addRecipient(Message.RecipientType.TO, new InternetAddress(email));
                message.setSubject("Validate");
                message.setText(link);
                Transport.send(message);
                log.info("Email sent successfully to " + email);
            } catch (MessagingException e) {
                log.error("Failed to send email to " + email, e);
            }
        });
    }
}