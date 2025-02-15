package org.example.auth_server.controller;

import jakarta.validation.Valid;
import org.example.auth_server.dto.ContactOrgInfoForApproveRequest;
import org.example.auth_server.dto.ContactOrganizatorInfoRequest;
import org.example.auth_server.model.Organizator;
import org.example.auth_server.service.OrganizatorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth/auth_service")
public class OrganizatorController {
    private final OrganizatorService organizatorService;

    @Autowired
    public OrganizatorController(OrganizatorService organizatorService) {
        this.organizatorService = organizatorService;
    }

    @PostMapping("/organizator")
    public ResponseEntity<String> safeOrganizator(@RequestBody @Valid ContactOrganizatorInfoRequest contactOrganizatorInfoRequest) {
        organizatorService.safeApproveInfo(contactOrganizatorInfoRequest);
        return ResponseEntity.ok("Данные организатора отправленны");
    }

    @GetMapping("/organizator/data")
    public ResponseEntity<Organizator> getOrganizator(@RequestParam(name = "email") String email) {
        ContactOrgInfoForApproveRequest info = new ContactOrgInfoForApproveRequest();
        info.setEmail(email);
        return ResponseEntity.ok(organizatorService.getOrganizator(info));
    }

    @PatchMapping("/organizator/data/approve")
    public ResponseEntity<String> approveOrganizator(@RequestBody @Valid ContactOrgInfoForApproveRequest contactOrganizatorInfoRequest) {
        organizatorService.changeApproveState(contactOrganizatorInfoRequest);
        return ResponseEntity.ok("Организатор одобрен");
    }
}
