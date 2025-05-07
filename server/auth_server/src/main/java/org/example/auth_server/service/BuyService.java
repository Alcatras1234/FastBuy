package org.example.auth_server.service;

import io.jsonwebtoken.JwtException;
import jakarta.persistence.EntityNotFoundException;
import org.example.auth_server.dto.match.BuyTicketRequest;
import org.example.auth_server.dto.match.ReturnTicketRequest;
import org.example.auth_server.dto.match.SeatsGetResponse;
import org.example.auth_server.model.actors.User;
import org.example.auth_server.model.match.Match;
import org.example.auth_server.model.match.Seats;
import org.example.auth_server.model.match.Ticket;
import org.example.auth_server.repository.match.MatchRepository;
import org.example.auth_server.repository.match.SeatsRepository;
import org.example.auth_server.repository.match.TicketRepository;
import org.example.auth_server.utils.JWTUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BuyService {

    private final SeatsRepository seatsRepository;
    private final TicketRepository ticketRepository;
    private final UserWorkService userWorkService;
    private final EmailService emailService;

    public BuyService(SeatsRepository seatsRepository, TicketRepository ticketRepository, UserWorkService userWorkService, EmailService emailService) {
        this.seatsRepository = seatsRepository;
        this.ticketRepository = ticketRepository;
        this.userWorkService = userWorkService;
        this.emailService = emailService;
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
        Match match = seat.getMatchId();
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
        ticket.setMatch(match);
        ticket.setPrice(seat.getPrice());


        // Обновляем статус мест
        ticketRepository.save(ticket); // Сохраняем билеты

        emailService.sendEmailWithTicket(email, ticket);

        return ticket;
    }

    @Transactional(readOnly = true)
    public List<SeatsGetResponse> getSeatsForUserDependsMatch(String token, String uuid) {
        if (!JWTUtils.validateToken(token)) {
            throw new JwtException("Токен не валиден");
        }
        String email = JWTUtils.extractClaim(token).get("email", String.class);

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

    @Transactional
    public void cancelTicket(ReturnTicketRequest returnTicketRequest) {
        String token = returnTicketRequest.getToken();
        if (!JWTUtils.validateToken(token)) {
            throw new JwtException("Токен не валиден");
        }
        String email = JWTUtils.extractClaim(token).get("email", String.class);

        Ticket ticket = ticketRepository.getTicketById(returnTicketRequest.getId()).orElseThrow(() -> {
            throw new EntityNotFoundException("Билет не найден");
        });

        Seats seat = seatsRepository.findSeatsBySeatNumber(ticket.getSeat().getSeatNumber()).orElseThrow(() -> {
            throw new EntityNotFoundException("Mесто не найдено");
        });

        seat.setStatus("free");
        seatsRepository.save(seat);

        ticket.setStatus("canceled");
        ticketRepository.save(ticket);

    }
}
