package org.example.auth_server.service;

import io.jsonwebtoken.JwtException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.example.auth_server.dto.match.BuyTicketRequest;
import org.example.auth_server.dto.match.SeatsGetResponse;
import org.example.auth_server.model.match.Match;
import org.example.auth_server.model.match.Seats;
import org.example.auth_server.model.match.Ticket;
import org.example.auth_server.model.actors.User;
import org.example.auth_server.repository.match.SeatsRepository;
import org.example.auth_server.repository.match.TicketRepository;
import org.example.auth_server.utils.JWTUtils;
import org.springframework.stereotype.Service;

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
    public Ticket buyTickets(BuyTicketRequest buyTicketRequest) {
        String token = buyTicketRequest.getToken();
        if (!JWTUtils.validateToken(token)) {
            throw new JwtException("Токен не валиден");
        }

        String email = JWTUtils.extractClaim(token).get("email", String.class);

        User user = userWorkService.getUser(email);


        // Помечаем место как забронированное
        Seats seat = seatsRepository.findSeatsBySeatNumber(buyTicketRequest.getSeatNumber()).orElseThrow(() -> {
            throw new EntityNotFoundException("Место не найдено");
        });
        if (!seat.getStatus().equals("free")) {
            throw new IllegalArgumentException("Место уже занято!");
        }
        seat.setStatus("booked");
        seatsRepository.save(seat);

        // Создаём билет
        Ticket ticket = new Ticket();
        ticket.setSeat(seat);
        ticket.setUser(user);
        ticket.setStatus("booked");
        ticket.setPrice(seat.getPrice());




        // Обновляем статус мест
        ticketRepository.save(ticket); // Сохраняем билеты

        return ticket;
    }

    @Transactional
    public List<SeatsGetResponse> getSeatsForUserDependsMatch(String token, String uuid) {
        if (!JWTUtils.validateToken(token)) {
            throw new JwtException("Токен не валиден");
        }
        String email = JWTUtils.extractClaim(token).get("email", String.class);
        Match match = userWorkService.findMatch(uuid, email);

        List<Seats> seats = seatsRepository.getSeatsByMatchId(uuid);

        return seats.stream()
                .map(seat -> {
                    SeatsGetResponse seatsGetResponse = new SeatsGetResponse();
                    seatsGetResponse.setSeatNumber(seat.getSeatNumber());
                    seatsGetResponse.setPrice(seat.getPrice());
                    seatsGetResponse.setRow(seat.getRow());
                    seatsGetResponse.setSector(seat.getSector());
                    return seatsGetResponse;
                })
                .toList();
    }
}
