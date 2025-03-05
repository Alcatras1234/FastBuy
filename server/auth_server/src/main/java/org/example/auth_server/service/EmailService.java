package org.example.auth_server.service;

import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.log4j.Log4j2;
import org.example.auth_server.AuthServiceConfig;
import org.example.auth_server.utils.JWTUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Objects;
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
        from = config.getGmail();
        password = config.getPassword();
    }

    private final ExecutorService executorService = Executors.newFixedThreadPool(10);


    public void sendEmailForVerify(String email) throws MessagingException {
        executorService.submit(() -> {
            log.info("Sending email from " + from);
            log.info("Sending password " + password);
            String host = "smtp.gmail.com";
            String validateToken = JWTUtils.generateValidateToken(email);
            String link = "http://193.187.172.248/valid-email/?token=" + validateToken;

            properties = System.getProperties();
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

            try {
                MimeMessage message = new MimeMessage(session);

                message.setFrom(new InternetAddress(from));
                message.addRecipients(Message.RecipientType.TO, String.valueOf(new InternetAddress(email)));

                message.setSubject("Validate");

                message.setText(link);

                Transport.send(message);
                log.info("Email are sended");


            } catch (MessagingException e) {
                try {
                    throw new MessagingException(e.getMessage());
                } catch (MessagingException ex) {
                    throw new RuntimeException(ex);
                }
            }
        });
    }

    private boolean equalsPassword(String databasePassword, String enteredPassword) {
        return Objects.equals(databasePassword, enteredPassword);
    }


}
