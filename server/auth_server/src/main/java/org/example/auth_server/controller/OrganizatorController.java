package org.example.auth_server.controller;

import jakarta.validation.Valid;
import org.example.auth_server.dto.ContactOrganizatorInfoRequest;
import org.example.auth_server.service.OrganizatorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth/auth_service")
public class OrganizatorController {
    private final OrganizatorService organizatorService;

    @Autowired
    public OrganizatorController(OrganizatorService organizatorService) {
        this.organizatorService = organizatorService;
    }

    @PutMapping("/update_org_data")
    public ResponseEntity<String> updateOrganizatorData(@RequestBody @Valid ContactOrganizatorInfoRequest contactOrganizatorInfoRequest) {
        organizatorService.updateLegalInfo(contactOrganizatorInfoRequest);
        return ResponseEntity.ok("Данные обновленны");
    }
}
