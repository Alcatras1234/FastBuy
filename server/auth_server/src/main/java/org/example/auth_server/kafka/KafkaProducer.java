//package org.example.auth_server.kafka;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.kafka.core.KafkaTemplate;
//import org.springframework.stereotype.Service;
//
//@Service
//public class KafkaProducer {
//
//    private static final String TOPIC = "validataion_group";
//
//    @Autowired
//    private KafkaTemplate<String, String> kafkaTemplate;
//
//    public void sendMessage(String key, String message) {
//        kafkaTemplate.send(TOPIC, key, message);
//    }
//}
