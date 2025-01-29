package org.example.ticket_service.kafka;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class KafkaProducer {

    private static final String TOPIC = "token-validation";

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    public void sendTokenForValidation(String token) {
        kafkaTemplate.send(TOPIC, token);
    }
}
