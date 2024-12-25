package org.example.auth_server.service;

import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import jakarta.persistence.EntityNotFoundException;

import lombok.extern.log4j.Log4j2;
import org.example.auth_server.dto.OTGRequest;
import org.example.auth_server.enums.StatusEnum;
import org.example.auth_server.model.OTGPassword;
import org.example.auth_server.model.User;
import org.example.auth_server.model.ValidatedEmails;
import org.example.auth_server.repository.OTGPasswordRepository;
import org.example.auth_server.repository.UserRepository;
import org.example.auth_server.repository.ValidatedEmailsRepository;
import org.springframework.beans.factory.annotation.Autowired;
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

    private final OTGPasswordRepository otgPasswordRepository;
    private final ValidatedEmailsRepository validatedEmailsRepository;

    private final ExecutorService executorService = Executors.newFixedThreadPool(10);

    @Autowired
    public EmailService(OTGPasswordRepository otgPasswordRepository, ValidatedEmailsRepository validatedEmailsRepository) {
        this.otgPasswordRepository = otgPasswordRepository;
        this.validatedEmailsRepository = validatedEmailsRepository;
    }

    @Async
    public void sendEmailForVerify(String email) {
        String host = "smtp.gmail.com";
        String otgPassword = OTPGenerator();

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

            message.setSubject("Test Mail");

            message.setText(otgPassword);

            Transport.send(message);
            log.info("Email are sended");


        } catch (MessagingException e) {
            throw new RuntimeException(e);
        } finally {
            OTGPassword otgPassword1 = new OTGPassword();
            otgPassword1.setOtgpassword(otgPassword);
            otgPassword1.setExpired(LocalDateTime.now().plusMinutes(2));
            otgPassword1.setValidate(false);
            otgPasswordRepository.save(otgPassword1);
        }
    }


    @Transactional
    public void checkOTGPassword(OTGRequest otgRequest) {
        Future<?> future = executorService.submit(() -> {
            var otgPassword = findEntityOTGPassword(otgRequest.getPassword());
            if (!otgPassword.isValidate() && LocalDateTime.now().isBefore(otgPassword.getExpired())) {
                if (equalsPassword(otgPassword.getOtgpassword(), otgRequest.getPassword())) {
                    ValidatedEmails validatedEmails = new ValidatedEmails();
                    validatedEmails.setEmail(otgRequest.getEmail());
                    otgPassword.setValidate(true);
                    otgPasswordRepository.save(otgPassword);
                    validatedEmailsRepository.save(validatedEmails);

                } else {
                    throw new IllegalArgumentException("Passwords are not equals");
                }
            } else {
                log.info("Нету такого пароля");
                throw new EntityNotFoundException("Нет нужного пароля или время его действия истекло, повторите попытку авторизации");
            }
        });

        try {
            future.get(); // Ожидаем завершения задачи и проверяем исключения
        } catch (ExecutionException e) {
            if (e.getCause() instanceof EntityNotFoundException) {
                throw (EntityNotFoundException) e.getCause();
            } else {
                throw new RuntimeException(e.getCause());
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Поток был прерван", e);
        }
    }


    private String OTPGenerator() {
        StringBuffer password = new StringBuffer();
        for (int i = 0; i < PASSWORDLENGTH; i++) {
            password.append(STRINGWITHNUMBERS.charAt(random.nextInt(STRINGWITHNUMBERS.length())));
        }
        return password.toString();
    }
    @Transactional(readOnly = true)
    protected OTGPassword findEntityOTGPassword(String otgPassword) {
        OTGPassword otgPasswordEntity = otgPasswordRepository.findByOtgpassword(otgPassword);
        if (otgPasswordEntity != null) {
            return  otgPasswordEntity;
        }
        throw new EntityNotFoundException("OTGPassword doesnt exist");
    }

    private boolean equalsPassword(String databasePassword, String enteredPassword) {
        return Objects.equals(databasePassword, enteredPassword);
    }


}
