package org.example.auth_server.controller;

import jakarta.validation.Valid;
import org.example.auth_server.dto.match.AddMatchRequest;
import org.example.auth_server.dto.organizator.ContactOrgInfoForApproveRequest;
import org.example.auth_server.dto.organizator.ContactOrganizatorInfoRequest;
import org.example.auth_server.dto.organizator.OrganizatorUpdateDataRequest;
import org.example.auth_server.dto.organizator.UnprovenOrganizationRequest;
import org.example.auth_server.model.match.Match;
import org.example.auth_server.model.actors.Organizator;
import org.example.auth_server.service.OrganizatorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import java.util.List;

@RestController
@RequestMapping("/api/organizer_service")
public class OrganizatorController {
    private final OrganizatorService organizatorService;

    @Autowired
    public OrganizatorController(OrganizatorService organizatorService) {
        this.organizatorService = organizatorService;
    }

    @Operation(summary = "Save organizer information")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Organizer information saved successfully")
    })
    @PostMapping("/organizator")
    public ResponseEntity<String> safeOrganizator(@RequestBody @Valid ContactOrganizatorInfoRequest contactOrganizatorInfoRequest) {
        organizatorService.safeApproveInfo(contactOrganizatorInfoRequest);
        return ResponseEntity.ok("Данные организатора отправленны");
    }

    @Operation(summary = "Get unapproved organizers")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "List of unapproved organizers retrieved successfully")
    })
    @GetMapping("/organizator/data/unprroved")
    public ResponseEntity<List<Organizator>> getOrganizator(@RequestParam(name = "page", defaultValue = "0") Integer page,
                                                            @RequestParam(name = "count", defaultValue = "10") Integer count) {
        return ResponseEntity.ok(organizatorService.getOrganizators(page, count));
    }

    @Operation(summary = "Set organizer as unapproved")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Organizer status set to unapproved successfully")
    })
    @PatchMapping("/organizator/data/unpprove")
    public ResponseEntity<String> setOrganizatorUnpproved(@RequestBody @Valid UnprovenOrganizationRequest info) {
        organizatorService.setUnpproved(info);
        return ResponseEntity.ok("Статус пользователя " + info.getEmail() + " изменен на 'Не одобрен'");
    }

    @Operation(summary = "Approve organizer")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Organizer approved successfully")
    })
    @PatchMapping("/organizator/data/approve")
    public ResponseEntity<String> approveOrganizator(@RequestBody @Valid ContactOrgInfoForApproveRequest contactOrganizatorInfoRequest) {
        organizatorService.changeApproveState(contactOrganizatorInfoRequest);
        return ResponseEntity.ok("Организатор одобрен");
    }

    @Operation(summary = "Get approved organizers")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "List of approved organizers retrieved successfully")
    })
    @GetMapping("/organizator/data/approved")
    public ResponseEntity<List<Organizator>> unapprovedOrganization(@RequestParam(name = "page", defaultValue = "0") Integer page,
                                                                    @RequestParam(name = "count", defaultValue = "10") Integer count) {
        return ResponseEntity.ok(organizatorService.getApprovedOrganizators(page, count));
    }

    @Operation(summary = "Get organizer profile")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Organizer profile retrieved successfully")
    })
    @GetMapping("/profile")
    public ResponseEntity<Organizator> getProfile(@RequestParam(name = "token") String token) {
        return ResponseEntity.ok(organizatorService.getProfile(token));
    }

    @Operation(summary = "Update organizer profile")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Organizer profile updated successfully")
    })
    @PutMapping("/profile/data")
    public ResponseEntity<Organizator> updateProfile(@RequestBody @Valid OrganizatorUpdateDataRequest info) {
        return ResponseEntity.ok(organizatorService.updateProfile(info));
    }

    @Operation(summary = "Add a match")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Match added successfully")
    })
    @PostMapping("/match")
    public ResponseEntity<Match> addMatch(@RequestBody @Valid AddMatchRequest info) throws Exception {
        return ResponseEntity.ok(organizatorService.addMatch(info));
    }

    @Operation(summary = "Get matches by organizer")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "List of matches retrieved successfully")
    })
    @GetMapping("/match/data")
    public ResponseEntity<List<Match>> getMatches(@RequestParam(name = "token") String token,
                                                  @RequestParam(name = "page", defaultValue = "0") Integer page,
                                                  @RequestParam(name = "count", defaultValue = "10") Integer count) throws IllegalAccessException {
        return ResponseEntity.ok(organizatorService.getMatchesByOrganizator(token, page, count));
    }

    @Operation(summary = "Update a match")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Match updated successfully")
    })
    @PutMapping("/match")
    public ResponseEntity<Match> putMatch(@RequestBody @Valid AddMatchRequest info,
                                          @RequestParam(name = "uuid") String uuid) throws IllegalAccessException {
        return ResponseEntity.ok(organizatorService.updateMatch(info, uuid));
    }

    @Operation(summary = "Delete a match")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Match deleted successfully")
    })
    @DeleteMapping("/match")
    public ResponseEntity<String> deleteMatch(@RequestParam(name = "token") String token,
                                              @RequestParam(name = "uuid") String uuid) throws IllegalAccessException {
        organizatorService.deleteMatch(token, uuid);
        return ResponseEntity.ok("Матч с id: " + uuid + " удален");
    }

}