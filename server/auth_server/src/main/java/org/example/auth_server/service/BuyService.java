package org.example.auth_server.service;

import io.jsonwebtoken.JwtException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.example.auth_server.dto.BuyTicketDTO;
import org.example.auth_server.model.Seats;
import org.example.auth_server.model.Ticket;
import org.example.auth_server.model.User;
import org.example.auth_server.repository.SeatsRepository;
import org.example.auth_server.repository.TicketRepository;
import org.example.auth_server.utils.JWTUtils;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.awt.print.Pageable;
import java.util.ArrayList;
import java.util.List;

@Service
public class BuyService {

    private final SeatsRepository seatsRepository;
    private final TicketRepository ticketRepository;
    private final UserWorkService userWorkService;

    public BuyService(SeatsRepository seatsRepository, TicketRepository ticketRepository, UserWorkService userWorkService) {
        this.seatsRepository = seatsRepository;
        this.ticketRepository = ticketRepository;
        this.userWorkService = userWorkService;
    }

    @Transactional
    public List<Ticket> buyTickets(BuyTicketDTO buyTicketDTO) {
        String token = buyTicketDTO.getToken();
        if (!JWTUtils.validateToken(token)) {
            throw new JwtException("Токен не валиден");
        }

        String email = JWTUtils.extractClaim(token).get("email", String.class);
        int ticketCount = Integer.parseInt(buyTicketDTO.getCount());

        User user = userWorkService.getUser(email);

        // Найти нужное количество свободных мест
        List<Seats> seats = seatsRepository.findTopNSeatsByStatus("free", ticketCount);

        if (seats.size() < ticketCount) {
            throw new IllegalStateException("Недостаточно свободных мест! Доступно только " + seats.size());
        }

        List<Ticket> tickets = new ArrayList<>();

        for (Seats seat : seats) {
            // Помечаем место как забронированное
            seat.setStatus("booked");
            seatsRepository.saveAndFlush(seat);

            // Создаём билет
            Ticket ticket = new Ticket();
            ticket.setSeat(seat);
            ticket.setUser(user);
            ticket.setStatus("booked");
            ticket.setPrice(seat.getPrice());

            tickets.add(ticket);
        }

        seatsRepository.saveAll(seats);   // Обновляем статус мест
        ticketRepository.saveAll(tickets); // Сохраняем билеты

        return tickets;
    }
}
