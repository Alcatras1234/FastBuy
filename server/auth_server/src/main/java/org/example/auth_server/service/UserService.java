package org.example.auth_server.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.JwtException;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.log4j.Log4j2;
import org.example.auth_server.model.actors.User;
import org.example.auth_server.model.match.Match;
import org.example.auth_server.model.match.Ticket;
import org.example.auth_server.repository.match.MatchRepository;
import org.example.auth_server.repository.match.TicketRepository;
import org.example.auth_server.utils.JWTUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.ConvertingCursor;
import org.springframework.data.redis.core.Cursor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ScanOptions;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Log4j2
public class UserService {
    private final MatchRepository matchRepository;
    private final UserWorkService userWorkService;
    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper objectMapper;
    private final TicketRepository ticketRepository;

    public UserService(MatchRepository matchRepository, UserWorkService userWorkService, RedisTemplate<String, Object> redisTemplate, ObjectMapper objectMapper, TicketRepository ticketRepository) {
        this.matchRepository = matchRepository;
        this.userWorkService = userWorkService;
        this.redisTemplate = redisTemplate;
        this.objectMapper = objectMapper;
        this.ticketRepository = ticketRepository;
    }

    public List<Match> getMatchForUser(String token, int page, int pageSize) {
        List<Match> matches = new ArrayList<>();

        if (!JWTUtils.validateToken(token)) {
            throw new JwtException("Токен не валиден");
        }


        String pattern = "match:" + ":*" + ":*";

        ScanOptions options = ScanOptions.scanOptions()
                .match(pattern)
                .count(pageSize)
                .build();

        int startIndex = page * pageSize;

        try (Cursor<String> cursor = (Cursor<String>) redisTemplate.executeWithStickyConnection(redisConnection ->
                new ConvertingCursor<>(redisConnection.scan(options), redisTemplate.getKeySerializer()::deserialize))) {
            int skipped = 0;
            while (cursor.hasNext()) {
                String key = cursor.next();
                Object value = redisTemplate.opsForValue().get(key);

                if (skipped < startIndex) {
                    skipped++;
                    continue;
                }


                matches.add(objectMapper.convertValue(value, Match.class));

                if (matches.size() >= pageSize) {
                    break;
                }

            }
        }

        if (matches.isEmpty()) {
            Pageable pageable = PageRequest.of(page, pageSize);
            Page<Match> orgPage = matchRepository.findMatches(pageable);
            matches = orgPage.getContent();
            if (!matches.isEmpty()) {
                matches.stream()
                        .forEach(userWorkService::saveMatchInCache);

            }
        }
        log.info("Закончил процесс GET информации матчи: ");
        return matches;
    }

    public List<Ticket> getTicketsForUser(String token, int page, int pageSize) {
        List<Ticket> tickets = new ArrayList<>();

        if (!JWTUtils.validateToken(token)) {
            throw new JwtException("Токен не валиден");
        }

        String email = JWTUtils.extractClaim(token).get("email", String.class);

        User user = userWorkService.getUser(email);

        Pageable pageable = PageRequest.of(page, pageSize);
        Page<Ticket> ticketPage = ticketRepository.findTicketsByUser(pageable, user);
        tickets = ticketPage.getContent();

        if (tickets.isEmpty()) {
            throw new EntityNotFoundException("Билеты не найдены");
        }

        return tickets;
    }
}
