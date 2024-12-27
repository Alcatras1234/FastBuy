package org.example.auth_server.kafka;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class KafkaConsumer {

    @KafkaListener(topics = "user-registration", groupId = "registration-service-group")
    public void consume(String message) {
        System.out.println("Получено сообщение: " + message);
    }
}

