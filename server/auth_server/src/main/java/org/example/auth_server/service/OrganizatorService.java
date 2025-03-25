package org.example.auth_server.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.JwtException;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.log4j.Log4j2;
import org.example.auth_server.dto.match.AddMatchRequest;
import org.example.auth_server.dto.match.SeatsForAddMatchRequest;
import org.example.auth_server.dto.organizator.ContactOrgInfoForApproveRequest;
import org.example.auth_server.dto.organizator.ContactOrganizatorInfoRequest;
import org.example.auth_server.dto.organizator.OrganizatorUpdateDataRequest;
import org.example.auth_server.dto.organizator.UnprovenOrganizationRequest;
import org.example.auth_server.model.actors.Organizator;
import org.example.auth_server.model.actors.User;
import org.example.auth_server.model.match.Match;
import org.example.auth_server.model.match.Seats;
import org.example.auth_server.model.match.Stadium;
import org.example.auth_server.repository.match.MatchRepository;
import org.example.auth_server.repository.OrganizatorRepository;
import org.example.auth_server.repository.match.SeatsRepository;
import org.example.auth_server.repository.match.StadiumRepository;
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
import org.springframework.transaction.UnexpectedRollbackException;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.IntStream;

@Service
@Log4j2
public class OrganizatorService {

    private final OrganizatorRepository organizatorRepository;
    private final MatchRepository matchRepository;
    private final StadiumRepository stadiumRepository;
    private final SeatsRepository seatsRepository;

    private final ObjectMapper objectMapper;

    private final RedisTemplate<String, Object> redisTemplate;
    private final UserWorkService userWorkService;


    @Autowired
    public OrganizatorService(OrganizatorRepository organizatorRepository, MatchRepository matchRepository, StadiumRepository stadiumRepository, SeatsRepository seatsRepository, ObjectMapper objectMapper, RedisTemplate<String, Object> redisTemplate, UserWorkService userWorkService) {
        this.organizatorRepository = organizatorRepository;
        this.matchRepository = matchRepository;
        this.stadiumRepository = stadiumRepository;
        this.seatsRepository = seatsRepository;
        this.objectMapper = objectMapper;
        this.redisTemplate = redisTemplate;
        this.userWorkService = userWorkService;
    }

    @Transactional
    public void safeApproveInfo(ContactOrganizatorInfoRequest info) {
        log.info("Начал процесс сохранения информации организатора: " + info.getEmail());


        User user = userWorkService.getUser(info.getEmail());

        Organizator organizator = new Organizator();
        organizator.setUser(user);
        organizator.setCompanyName(info.getCompanyName());
        organizator.setContactNumber(info.getContactNumber());
        organizatorRepository.save(organizator);

        userWorkService.saveOrganizatorInCache(organizator);

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
            Page<Organizator> orgPage = organizatorRepository.findAll(pageable);
            organizators = orgPage.getContent();
            if (!organizators.isEmpty()) {
                organizators.stream()
                        .filter(org -> !org.isApproved())
                        .forEach(userWorkService::saveOrganizatorInCache);
            }
        }
        log.info("Закончил процесс GET информации организатора: ");
        return organizators;
    }

    @Transactional
    public void changeApproveState(ContactOrgInfoForApproveRequest info) {
        log.info("Начал процесс APPROVE информации организатора: " + info.getEmail());

        Organizator organizator = userWorkService.findOrganizator(info.getEmail());

        organizator.setApproved(true);
        organizator.setUpdatedDttm(LocalDateTime.now());
        organizatorRepository.save(organizator);

        userWorkService.saveOrganizatorInCache(organizator);

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

            Page<Organizator> orgPage = organizatorRepository.findAll(pageable);
            organizators = orgPage.getContent();
            if (!organizators.isEmpty()) {
                organizators.stream()
                        .filter(org -> org.isApproved())
                        .forEach(userWorkService::saveOrganizatorInCache);
            }
        }
        log.info("Закончил процесс GET информации организатора: ");
        return organizators;
    }

    @Transactional // Убирает организатора из одобренных
    public void setUnpproved(UnprovenOrganizationRequest info) {
        log.info("Начал процесс сохранения информации организатора: " + info.getEmail());


        Organizator organizator = userWorkService.findOrganizator(info.getEmail());


        organizator.setApproved(false);
        organizatorRepository.save(organizator);

        userWorkService.saveOrganizatorInCache(organizator);

        log.info("Закончил процесс сохранения информации организатора: " + info.getEmail());
    }

    @Transactional(readOnly = true)
    public Organizator getProfile(String token) {
        if (!JWTUtils.validateToken(token)) {
            throw new JwtException("Токен не валиден");
        }

        String email = JWTUtils.extractClaim(token).get("email", String.class);

        Organizator organizator = userWorkService.findOrganizator(email);

        return organizator;
    }

    @Transactional
    public Organizator updateProfile(OrganizatorUpdateDataRequest info) {
        String token = info.getToken();
        if (!JWTUtils.validateToken(token)) {
            throw new JwtException("Токен не валиден");
        }

        String email = JWTUtils.extractClaim(token).get("email", String.class);


        Organizator organizator = userWorkService.findOrganizator(email);


        organizator.setContactNumber(info.getContactPhone());
        organizator.setCompanyName(info.getCompanyName());
        organizator.setBankAccount(info.getBankAccount());
        organizatorRepository.saveAndFlush(organizator);

        userWorkService.saveOrganizatorInCache(organizator);

        return organizator;
    }

    @Transactional
    public Match addMatch(AddMatchRequest info) throws Exception {
        String token = info.getToken();
        if (!JWTUtils.validateToken(token)) {
            throw new JwtException("Токен не валиден");
        }
        String email = JWTUtils.extractClaim(token).get("email", String.class);


        User user = userWorkService.getUser(email);


        if (!user.isVerify()) {
            throw new IllegalAccessException("Пользователь не провалидирован");
        }

        inOrganizators(user);

        Match match = new Match();
        Stadium stadium = new Stadium();


        try {
            String uuid = String.valueOf(UUID.randomUUID());
            match.setTeamHomeName(info.getTeamA());
            match.setTeamAwayName(info.getTeamB());
            match.setScheduleDate(info.getDate());
            match.setScheduleTimeLocal(info.getTime());
            match.setStadiumName(info.getStadium());
            match.setTicketsCount(info.getSeats().size());
            match.setUuid(uuid);
            log.info("Пользователь: " + user);
            match.setOrganizer(user);
            matchRepository.save(match);

            stadium.setName(info.getStadium());
            stadiumRepository.saveAndFlush(stadium);

            addSeats(info.getSeats(), match, stadium);

            String key = "match:" + email + ":" + uuid;
            redisTemplate.opsForValue().set(key, match, Duration.ofMinutes(10));
        } catch (UnexpectedRollbackException e) {
            log.error(e.getMessage());
            throw new UnexpectedRollbackException(e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new Exception(e.getMessage());
        }
        return match;
    }

    @Transactional(readOnly = true)
    public List<Match> getMatchesByOrganizator(String token, int page, int pageSize) throws IllegalAccessException {
        List<Match> matches = new ArrayList<>();

        if (!JWTUtils.validateToken(token)) {
            throw new JwtException("Токен не валиден");
        }


        String email = JWTUtils.extractClaim(token).get("email", String.class);

        User user = userWorkService.getUser(email);

        if (!user.isVerify()) {
            throw new IllegalAccessException("Пользователь не провалидирован");
        }

        inOrganizators(user);

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
            Page<Match> orgPage = matchRepository.findMatchesByOrganizer(user, pageable);
            matches = orgPage.getContent();
            if (!matches.isEmpty()) {
                matches.stream()
                        .forEach(userWorkService::saveMatchInCache);

            }
        }
        log.info("Закончил процесс GET информации матчи: ");
        return matches;
    }

    // TODO: ПЕРЕПИСАТЬ
    @Transactional
    public Match updateMatch(AddMatchRequest info, String uuid) throws IllegalAccessException {
        String token = info.getToken();
        if (!JWTUtils.validateToken(token)) {
            throw new JwtException("Токен не валиден");
        }
        String email = JWTUtils.extractClaim(token).get("email", String.class);

        User user = userWorkService.getUser(email);
        if (!user.isVerify()) {
            throw new IllegalAccessException("Пользователь не провалидирован");
        }
        inOrganizators(user);

        Match match = userWorkService.findMatch(uuid, email);

        match.setTeamHomeName(info.getTeamA());
        match.setTeamAwayName(info.getTeamB());
        match.setScheduleDate(info.getDate());
        match.setScheduleTimeLocal(info.getTime());
        match.setStadiumName(info.getStadium());
        //match.setTicketsCount(info.getSeats().size());

        matchRepository.save(match);

        userWorkService.saveMatchInCache(match);
        return match;
    }

    @Transactional
    public void deleteMatch(String token, String uuid) throws IllegalAccessException {
        if (!JWTUtils.validateToken(token)) {
            throw new JwtException("Токен не валиден");
        }
        String email = JWTUtils.extractClaim(token).get("email", String.class);

        User user = userWorkService.getUser(email);
        if (!user.isVerify()) {
            throw new IllegalAccessException("Пользователь не провалидирован");
        }
        inOrganizators(user);

        Match match = userWorkService.findMatch(uuid, email);

        matchRepository.delete(match);

        userWorkService.deleteMatchFromCache(uuid, email);
    }

    private void inOrganizators(User user) {
        Organizator organizator = organizatorRepository.findOrganizatorByUser(user).orElseThrow(() -> {
            throw new EntityNotFoundException("Пользователь не является организатором");
        });
        if (!organizator.isApproved()) {
            throw new IllegalArgumentException("Организатор не подтвержден");
        }
    }

    @Transactional
    protected void addSeats(List<SeatsForAddMatchRequest> seats, Match match, Stadium stadium) {
        seats.stream()
                        .forEach(seatInfo -> {
                            IntStream.rangeClosed(seatInfo.getSeatStart(), seatInfo.getSeatEnd())
                                    .mapToObj(seatNumber -> {
                                        Seats seat = new Seats();
                                        seat.setRow(seatInfo.getRow());
                                        seat.setSector(seatInfo.getSector());
                                        seat.setSeatNumber(seatInfo.getSector() + seatInfo.getRow() + seatNumber);
                                        seat.setStadiumId(stadium);
                                        seat.setMatchId(match);
                                        seat.setPrice(seatInfo.getPrice());
                                        seat.setStatus("free");
                                        return seat;
                                    })
                                    .forEach(seatsRepository::save);
                        });
        log.info("Закончил добавлять билеты на матч {}", match);
    }
}
