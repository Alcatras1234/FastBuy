package org.example.auth_server.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.JwtException;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.log4j.Log4j2;
import org.example.auth_server.dto.ContactOrgInfoForApproveRequest;
import org.example.auth_server.dto.ContactOrganizatorInfoRequest;
import org.example.auth_server.dto.OrganizatorUpdateDataRequest;
import org.example.auth_server.dto.UnprovenOrganizationRequest;
import org.example.auth_server.model.Organizator;
import org.example.auth_server.model.User;
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

    private final ObjectMapper objectMapper;

    private final RedisTemplate redisTemplate;


    @Autowired
    public OrganizatorService(OrganizatorRepository organizatorRepository, UserRepository userRepository, ObjectMapper objectMapper, RedisTemplate redisTemplate) {
        this.organizatorRepository = organizatorRepository;
        this.userRepository = userRepository;
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
        organizator = (Organizator) redisTemplate.opsForValue().get(key);

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
        User user = userRepository.findUserByEmail(info.getEmail()).orElseThrow(() -> {
            throw new EntityNotFoundException("Пользователь не найден");
        });
        String key = "organizator:" + user.getEmail();

        Organizator organizator = organizatorRepository.findOrganizatorByUser(user).get();

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
        User user = userRepository.findUserByEmail(email).orElseThrow(() -> {
            throw new EntityNotFoundException("пользователь не найден");
        });

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
        User user = userRepository.findUserByEmail(email).orElseThrow(() -> {
            throw new EntityNotFoundException("пользователь не найден");
        });
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

}
