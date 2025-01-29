package org.example.ticket_service.controllers;

import jakarta.validation.Valid;
import org.example.ticket_service.dto.UpdateOrganizatorResponse;
import org.example.ticket_service.kafka.KafkaProducer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ticket_service/organizator")
public class OrganizatorController {

    private final KafkaProducer kafkaProducer;

    @Autowired
    public OrganizatorController(KafkaProducer kafkaProducer) {
        this.kafkaProducer = kafkaProducer;
    }

    @PutMapping("/update_info")
    public ResponseEntity<String> updateOrganizatorData(@RequestBody @Valid UpdateOrganizatorResponse updateOrganizatorResponse) {
        kafkaProducer.sendTokenForValidation(updateOrganizatorResponse.getAccessToken());
        return ResponseEntity.ok("хюу.й");
    }
}
