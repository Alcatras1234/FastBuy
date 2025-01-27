package org.example.auth_server.kafka;

import lombok.extern.log4j.Log4j2;
import org.example.auth_server.utils.JWTUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@Log4j2
public class KafkaConsumer {
    private final KafkaTemplate<String, String> kafkaTemplate;

    @Autowired
    public KafkaConsumer(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    @KafkaListener(topics = "validataion_group", groupId = "auth_service")
    public void validateToken(String message) {
        log.info("Получил сообщение" + message);
        boolean isValid = JWTUtils.validateToken(message);
        String response = isValid ? "VALID" : "INVALID";
        kafkaTemplate.send("token-validation-response", response);
        log.info("Отправил ответ" + response);
    }
}

