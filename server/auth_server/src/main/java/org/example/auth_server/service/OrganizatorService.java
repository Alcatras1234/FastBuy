package org.example.auth_server.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.JwtException;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.log4j.Log4j2;
import org.example.auth_server.dto.AddMatchRequest;
import org.example.auth_server.dto.organizator.ContactOrgInfoForApproveRequest;
import org.example.auth_server.dto.organizator.ContactOrganizatorInfoRequest;
import org.example.auth_server.dto.organizator.OrganizatorUpdateDataRequest;
import org.example.auth_server.dto.organizator.UnprovenOrganizationRequest;
import org.example.auth_server.model.Match;
import org.example.auth_server.model.Organizator;
import org.example.auth_server.model.User;
import org.example.auth_server.repository.MatchRepository;
import org.example.auth_server.repository.OrganizatorRepository;
import org.example.auth_server.repository.UserRepository;
import org.example.auth_server.utils.JWTUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.ConvertingCursor;
import org.springframework.data.redis.core.Cursor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ScanOptions;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;

@Service
@Log4j2
public class OrganizatorService {

    private final OrganizatorRepository organizatorRepository;
    private final UserRepository userRepository;
    private final MatchRepository matchRepository;

    private final ObjectMapper objectMapper;

    private final RedisTemplate redisTemplate;


    @Autowired
    public OrganizatorService(OrganizatorRepository organizatorRepository, UserRepository userRepository, MatchRepository matchRepository, ObjectMapper objectMapper, RedisTemplate redisTemplate) {
        this.organizatorRepository = organizatorRepository;
        this.userRepository = userRepository;
        this.matchRepository = matchRepository;
        this.objectMapper = objectMapper;
        this.redisTemplate = redisTemplate;
    }

    @Transactional
    public void safeApproveInfo(ContactOrganizatorInfoRequest info) {
        log.info("Начал процесс сохранения информации организатора: " + info.getEmail());
        String key = "organizator:" + info.getEmail();
        User user = userRepository.findUserByEmail(info.getEmail()).orElseThrow(() -> {
            throw new EntityNotFoundException("Пользователь не найден");
        });

        Organizator organizator = new Organizator();
        organizator.setUser(user);
        organizator.setCompanyName(info.getCompanyName());
        organizator.setContactNumber(info.getContactNumber());
        organizatorRepository.save(organizator);
        redisTemplate.opsForValue().set(key, organizator, Duration.ofMinutes(10));
        log.info("Закончил процесс сохранения информации организатора: " + info.getEmail());
    }

    @Transactional(readOnly = true)
    public List<Organizator> getOrganizators(int page, int pageSize) {
        List<Organizator> organizators = new ArrayList<Organizator>();

        String pattern = "organizator:" + "*";
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


                organizators.add(objectMapper.convertValue(value, Organizator.class));

                if (organizators.size() >= pageSize) {
                    break;
                }

            }
        }

        if (organizators.isEmpty()) {
            Pageable pageable = PageRequest.of(page, pageSize);
            Map<String, Organizator> keys = new HashMap<>();
            Page<Organizator> orgPage = organizatorRepository.findAll(pageable);
            organizators = orgPage.getContent();
            if (!organizators.isEmpty()) {
                organizators.stream()
                        .filter(org -> !org.isApproved())
                        .forEach(organizator -> {
                            String key = "organizator:" + organizator.getUser().getEmail();
                            keys.put(key, organizator);
                        });


                keys.entrySet().stream()
                        .forEach(pair -> {
                            redisTemplate.opsForValue().set(pair.getKey(), pair.getValue(), Duration.ofMinutes(10));
                        });
            }
        }
        log.info("Закончил процесс GET информации организатора: ");
        return organizators;
    }

    @Transactional
    public void changeApproveState(ContactOrgInfoForApproveRequest info) {
        log.info("Начал процесс APPROVE информации организатора: " + info.getEmail());
        String key = "organizator:" + info.getEmail();
        Organizator organizator = null;
        organizator = objectMapper.convertValue(redisTemplate.opsForValue().get(key), Organizator.class);

        if (organizator == null) {

            User user = userRepository.findUserByEmail(info.getEmail()).orElseThrow(() -> {
                throw new EntityNotFoundException("Пользователь не найден");
            });

            organizator = organizatorRepository.findOrganizatorByUser(user).orElseThrow(() -> {
                throw new EntityNotFoundException("Организатор не найден не найден");
            });

        }

        organizator.setApproved(true);
        organizator.setUpdatedDttm(LocalDateTime.now());
        organizatorRepository.save(organizator);
        redisTemplate.opsForValue().set(key, organizator, Duration.ofMinutes(10));
        log.info("Закончил процесс APPROVE информации орагнизатора: " + info.getEmail());
    }


    @Transactional(readOnly = true)
    public List<Organizator> getApprovedOrganizators(int page, int pageSize) {
        List<Organizator> organizators = new ArrayList<Organizator>();

        String pattern = "organizator:" + "*";
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


                organizators.add(objectMapper.convertValue(value, Organizator.class));

                if (organizators.size() >= pageSize) {
                    break;
                }

            }
        }

        if (organizators.isEmpty()) {
            Pageable pageable = PageRequest.of(page, pageSize);
            Map<String, Organizator> keys = new HashMap<>();
            Page<Organizator> orgPage = organizatorRepository.findAll(pageable);
            organizators = orgPage.getContent();
            if (!organizators.isEmpty()) {
                organizators.stream()
                        .filter(org -> org.isApproved())
                        .forEach(organizator -> {
                            String key = "organizator:" + organizator.getUser().getEmail();
                            keys.put(key, organizator);
                        });


                keys.entrySet().stream()
                        .forEach(pair -> {
                            redisTemplate.opsForValue().set(pair.getKey(), pair.getValue(), Duration.ofMinutes(10));
                        });
            }
        }
        log.info("Закончил процесс GET информации организатора: ");
        return organizators;
    }

    @Transactional // Убирает организатора из одобренных
    public void setUnpproved(UnprovenOrganizationRequest info) {
        log.info("Начал процесс сохранения информации организатора: " + info.getEmail());
        String key = "organizator:" + info.getEmail();

        Organizator organizator = objectMapper.convertValue(redisTemplate.opsForValue().get(key), Organizator.class);

        if (organizator == null) {

            User user = userRepository.findUserByEmail(info.getEmail()).orElseThrow(() -> {
                throw new EntityNotFoundException("Пользователь не найден");
            });

            organizator = organizatorRepository.findOrganizatorByUser(user).get();

        }

        organizator.setApproved(false);
        organizatorRepository.save(organizator);
        redisTemplate.delete(key);
        redisTemplate.opsForValue().set(key, organizator, Duration.ofMinutes(10));
        log.info("Закончил процесс сохранения информации организатора: " + info.getEmail());
    }

    @Transactional(readOnly = true)
    public Organizator getProfile(String token) {
        if (!JWTUtils.validateToken(token)) {
            throw new JwtException("Токен не валиден");
        }

        String email = JWTUtils.extractClaim(token).get("email", String.class);
        String keyUser = "user:" + email;

        User user = objectMapper.convertValue(redisTemplate.opsForValue().get(keyUser), User.class);
        if (user == null) {

            user = userRepository.findUserByEmail(email).orElseThrow(() -> {
                throw new EntityNotFoundException("пользователь не найден");
            });
        }

        String key = "organizator:" + user.getEmail();
        Organizator organizator = objectMapper.convertValue( redisTemplate.opsForValue().get(key), Organizator.class);
        if (organizator == null) {
            organizator = organizatorRepository.findOrganizatorByUser(user).orElseThrow(() -> {
                throw new EntityNotFoundException("пользователь не найден");
            });

            redisTemplate.opsForValue().set(key, organizator, Duration.ofMinutes(10));

        }
        return organizator;
    }

    @Transactional
    public Organizator updateProfile(OrganizatorUpdateDataRequest info) {
        String token = info.getToken();
        if (!JWTUtils.validateToken(token)) {
            throw new JwtException("Токен не валиден");
        }

        String email = JWTUtils.extractClaim(token).get("email", String.class);
        String keyUser = "user:" + email;

        User user = objectMapper.convertValue(redisTemplate.opsForValue().get(keyUser), User.class);
        if (user == null) {

            user = userRepository.findUserByEmail(email).orElseThrow(() -> {
                throw new EntityNotFoundException("пользователь не найден");
            });
        }
        String key = "organizator:" + user.getEmail();
        Organizator organizator = objectMapper.convertValue( redisTemplate.opsForValue().get(key), Organizator.class);

        if (organizator == null) {
            organizator = organizatorRepository.findOrganizatorByUser(user).orElseThrow(() -> {
                throw new EntityNotFoundException("пользователь не найден");
            });
        }
        organizator.setContactNumber(info.getContactPhone());
        organizator.setCompanyName(info.getCompanyName());
        organizator.setBankAccount(info.getBankAccount());
        organizatorRepository.save(organizator);

        redisTemplate.opsForValue().set(key, organizator, Duration.ofMinutes(10));
        return organizator;
    }

    @Transactional
    public Match addMatch(AddMatchRequest info) {
        String token = info.getToken();
        if (!JWTUtils.validateToken(token)) {
            throw new JwtException("Токен не валиден");
        }
        String email = JWTUtils.extractClaim(token).get("email", String.class);

        String keyUser = "user:" + email;

        User user = objectMapper.convertValue(redisTemplate.opsForValue().get(keyUser), User.class);
        if (user == null) {

            user = userRepository.findUserByEmail(email).orElseThrow(() -> {
                throw new EntityNotFoundException("пользователь не найден");
            });
        }

        Match match = new Match();

        match.setTeamHomeName(info.getTeamA());
        match.setTeamAwayName(info.getTeamB());
        match.setScheduleDate(info.getDate());
        match.setScheduleTimeLocal(info.getTime());
        match.setStadiumName(info.getStadium());
        match.setTicketsCount(info.getTickets());
        match.setTicketsPrice(info.getTicketPrice());
        match.setOrganizer(user);
        matchRepository.save(match);
        Match match1 = matchRepository.findMatchByOrganizer(user);
        String key = "match:" + user.getEmail() + ":" + match1.getId();
        redisTemplate.opsForValue().set(key, match1, Duration.ofMinutes(10));
        return match;
    }

    @Transactional(readOnly = true)
    public List<Match> getMatches(String token, int page, int pageSize) {
        List<Match> matches = new ArrayList<>();

        if (!JWTUtils.validateToken(token)) {
            throw new JwtException("Токен не валиден");
        }


        String email = JWTUtils.extractClaim(token).get("email", String.class);

        String keyUser = "user:" + email;

        User user = objectMapper.convertValue(redisTemplate.opsForValue().get(keyUser), User.class);
        if (user == null) {

            user = userRepository.findUserByEmail(email).orElseThrow(() -> {
                throw new EntityNotFoundException("пользователь не найден");
            });
        }

        String pattern = "match:" + email + ":*";
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
            Map<String, Match> keys = new HashMap<>();
            Page<Match> orgPage = matchRepository.findMatchesByOrganizer(user, pageable);
            matches = orgPage.getContent();
            if (!matches.isEmpty()) {
                matches.stream()
                        .forEach(match -> {
                            String key = "match:" + email + ":" + match.getId();
                            keys.put(key, match);
                        });
                keys.entrySet().stream()
                        .forEach(pair -> {
                            redisTemplate.opsForValue().set(pair.getKey(), pair.getValue(), Duration.ofMinutes(10));
                        });
            }
        }
        log.info("Закончил процесс GET информации матчи: ");
        return matches;
    }

    @Transactional
    public Match updateMatch(AddMatchRequest info, Long id) {
        String token = info.getToken();
        if (!JWTUtils.validateToken(token)) {
            throw new JwtException("Токен не валиден");
        }
        String email = JWTUtils.extractClaim(token).get("email", String.class);
        String keyUser = "user:" + email;
        User user = objectMapper.convertValue(redisTemplate.opsForValue().get(keyUser), User.class);
        if (user == null) {
            user = userRepository.findUserByEmail(email).orElseThrow(() -> {
                throw new EntityNotFoundException("пользователь не найден");
            });
        }
        String key = "match:" + email + ":" + id;
        Match match = matchRepository.findMatchById(id).orElseThrow(() -> {
            throw new EntityNotFoundException("Матч не найден");
        });
        match.setTeamHomeName(info.getTeamA());
        match.setTeamAwayName(info.getTeamB());
        match.setScheduleDate(info.getDate());
        match.setScheduleTimeLocal(info.getTime());
        match.setStadiumName(info.getStadium());
        match.setTicketsCount(info.getTickets());
        match.setTicketsPrice(info.getTicketPrice());

        matchRepository.save(match);
        redisTemplate.opsForValue().set(key, match, Duration.ofMinutes(10));
        return match;
    }

    @Transactional
    public void deleteMatch(String token, Long id) {
        if (!JWTUtils.validateToken(token)) {
            throw new JwtException("Токен не валиден");
        }
        String email = JWTUtils.extractClaim(token).get("email", String.class);
        String keyUser = "user:" + email;
        User user = objectMapper.convertValue(redisTemplate.opsForValue().get(keyUser), User.class);
        if (user == null) {
            user = userRepository.findUserByEmail(email).orElseThrow(() -> {
                throw new EntityNotFoundException("пользователь не найден");
            });
        }

        String key = "match:" + email + ":" + id;

        Match match = objectMapper.convertValue(redisTemplate.opsForValue().get(key), Match.class);

        if (match == null) {
            match = matchRepository.findMatchById(id).orElseThrow(() -> {
                throw new EntityNotFoundException("Матч не найден");
            });
        }

        matchRepository.delete(match);
    }
}
