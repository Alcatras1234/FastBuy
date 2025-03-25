package org.example.auth_server.controller;

import jakarta.validation.Valid;
import org.example.auth_server.dto.match.BuyTicketRequest;
import org.example.auth_server.dto.match.SeatsGetResponse;
import org.example.auth_server.model.match.Ticket;
import org.example.auth_server.service.BuyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/buyservice/")
public class BuyController {

    private final BuyService buyService;

    public BuyController(BuyService buyService) {
        this.buyService = buyService;
    }

    @PostMapping("/ticket")
    public ResponseEntity<Ticket> buyTicket(@Valid @RequestBody BuyTicketRequest buyTicketRequest) {
        return ResponseEntity.ok().body(buyService.buyTickets(buyTicketRequest));
    }

    @GetMapping("/ticket")
    public ResponseEntity<List<SeatsGetResponse>> getTickets(@RequestParam(name="token") String token,
                                                             @RequestParam(name="match_uuid") String uuid) {
        return ResponseEntity.ok().body(buyService.getSeatsForUserDependsMatch(token, uuid));
    }
}
