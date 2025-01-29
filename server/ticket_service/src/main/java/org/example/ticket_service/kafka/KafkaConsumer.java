package org.example.ticket_service.kafka;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class KafkaConsumer {

    @KafkaListener(topics = "token-validation-response", groupId = "ticket-service-group")
    public boolean handleValidationResponse(String response) {
        if ("VALID".equals(response)) {
            return true;
        } else {
            throw new IllegalArgumentException("Токен не валиден");
        }
    }
}

