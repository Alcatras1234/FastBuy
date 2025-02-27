package org.example.auth_server.controller;

import jakarta.validation.Valid;
import org.example.auth_server.dto.AddMatchRequest;
import org.example.auth_server.dto.organizator.ContactOrgInfoForApproveRequest;
import org.example.auth_server.dto.organizator.ContactOrganizatorInfoRequest;
import org.example.auth_server.dto.organizator.OrganizatorUpdateDataRequest;
import org.example.auth_server.dto.organizator.UnprovenOrganizationRequest;
import org.example.auth_server.model.Match;
import org.example.auth_server.model.Organizator;
import org.example.auth_server.service.OrganizatorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/organizer_service")
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
    public ResponseEntity<String> setOrganizatorUnpproved(@RequestBody @Valid UnprovenOrganizationRequest info) {
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

    @GetMapping("/profile")
    public ResponseEntity<Organizator> getProfile(@RequestParam(name = "token") String token) {
        return ResponseEntity.ok(organizatorService.getProfile(token));
    }

    @PutMapping("/profile/data")
    public ResponseEntity<Organizator> updateProfile(@RequestBody @Valid OrganizatorUpdateDataRequest info) {
        return ResponseEntity.ok(organizatorService.updateProfile(info));
    }

    @PostMapping("/match")
    public ResponseEntity<Match> addMatch(@RequestBody @Valid AddMatchRequest info) {
        return ResponseEntity.ok(organizatorService.addMatch(info));
    }

    @GetMapping("/match/data")
    public ResponseEntity<List<Match>> getMatches(@RequestParam(name = "token") String token,
                                                  @RequestParam(name = "page", defaultValue = "0") Integer page,
                                                  @RequestParam(name = "count", defaultValue = "10") Integer count) {
        return ResponseEntity.ok(organizatorService.getMatches(token, page, count));

    }

    @PutMapping("/match")
    public ResponseEntity<Match> putMatch(@RequestBody @Valid AddMatchRequest info,
                                          @RequestParam(name = "id") Long id) {
        return ResponseEntity.ok(organizatorService.updateMatch(info, id));
    }

}
