package org.example.auth_server.controller;

import jakarta.validation.Valid;
import org.example.auth_server.dto.ContactOrgInfoForApproveRequest;
import org.example.auth_server.dto.ContactOrganizatorInfoRequest;
import org.example.auth_server.dto.UnprovenOrganizationRequest;
import org.example.auth_server.model.Organizator;
import org.example.auth_server.service.OrganizatorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/organizator/data/unprroved")
    public ResponseEntity<List<Organizator>> getOrganizator(@RequestParam(name = "page", defaultValue = "0") Integer page,
                                                            @RequestParam(name = "count", defaultValue = "10") Integer count) {
        return ResponseEntity.ok(organizatorService.getOrganizators(page, count));
    }

    @PatchMapping("/organizator/data/unpprove")
    public ResponseEntity<String> setOrganizatorUnpproved(UnprovenOrganizationRequest info) {
        organizatorService.setUnpproved(info);
        return ResponseEntity.ok("Статус пользователя " + info.getEmail() + " изменен на 'Не одобрен'");
    }

    @PatchMapping("/organizator/data/approve")
    public ResponseEntity<String> approveOrganizator(@RequestBody @Valid ContactOrgInfoForApproveRequest contactOrganizatorInfoRequest) {
        organizatorService.changeApproveState(contactOrganizatorInfoRequest);
        return ResponseEntity.ok("Организатор одобрен");
    }

    @GetMapping("/organizator/data/approved")
    public ResponseEntity<List<Organizator>> unapprovedOrganization(@RequestParam(name = "page", defaultValue = "0") Integer page,
                                                                    @RequestParam(name = "count", defaultValue = "10") Integer count) {
        return ResponseEntity.ok(organizatorService.getApprovedOrganizators(page, count));
    }
}
