package org.example.auth_server.controller;

import jakarta.validation.Valid;
import org.example.auth_server.dto.BuyTicketDTO;
import org.example.auth_server.model.Ticket;
import org.example.auth_server.service.BuyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/buyservice/")
public class BuyController {

    private final BuyService buyService;

    public BuyController(BuyService buyService) {
        this.buyService = buyService;
    }

    @PostMapping("/ticket")
    public ResponseEntity<List<Ticket>> buyTicket(@Valid @RequestBody BuyTicketDTO buyTicketDTO) {
        return ResponseEntity.ok().body(buyService.buyTickets(buyTicketDTO));
    }
}
