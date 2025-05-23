package org.example.auth_server.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.PersistenceContext;
import org.example.auth_server.model.match.Match;
import org.example.auth_server.model.actors.Organizator;
import org.example.auth_server.model.actors.User;
import org.example.auth_server.repository.match.MatchRepository;
import org.example.auth_server.repository.OrganizatorRepository;
import org.example.auth_server.repository.UserRepository;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;

@Service
public class UserWorkService {
    private final ObjectMapper objectMapper;
    private final RedisTemplate<String, Object> redisTemplate;
    private final UserRepository userRepository;
    private final OrganizatorRepository organizatorRepository;
    private final MatchRepository matchRepository;


    @PersistenceContext
    private EntityManager entityManager;


    public UserWorkService(ObjectMapper objectMapper, RedisTemplate<String, Object> redisTemplate, UserRepository userRepository, OrganizatorRepository organizatorRepository, MatchRepository matchRepository) {
        this.objectMapper = objectMapper;
        this.redisTemplate = redisTemplate;
        this.userRepository = userRepository;
        this.organizatorRepository = organizatorRepository;
        this.matchRepository = matchRepository;
    }

    @Transactional(readOnly = true)
    protected User getUser(String email) {

        String key = "user:" + email;
        User user = objectMapper.convertValue(redisTemplate.opsForValue().get(key), User.class);

        if (user == null) {
            user = userRepository.findUserByEmail(email).orElseThrow(() -> {
                throw new EntityNotFoundException("Пользователь не найден");
            });

            saveUserInCache(user);
        } else {
            user = entityManager.merge(user);
        }

        return user;
    }

    protected void saveUserInCache(User user) {
        String key = "user:" + user.getEmail();
        redisTemplate.opsForValue().set(key, user, Duration.ofMinutes(10));
    }

    protected void saveOrganizatorInCache(Organizator organizator) {
        String key = "organizator:" + organizator.getUser().getEmail();
        redisTemplate.opsForValue().set(key, organizator, Duration.ofMinutes(10));
    }

    @Transactional(readOnly = true)
    protected Organizator findOrganizator(String email) {
        String key = "organizator:" + email;
        Organizator organizator = objectMapper.convertValue(redisTemplate.opsForValue().get(key), Organizator.class);
        if (organizator == null) {

            User user = userRepository.findUserByEmail(email).orElseThrow(() -> {
                throw new EntityNotFoundException("Пользователь не найден");
            });

            organizator = organizatorRepository.findOrganizatorByUser(user).orElseThrow(() -> {
                throw new EntityNotFoundException("Организатор не найден не найден");
            });

        } else {
            organizator = entityManager.merge(organizator);
        }
        return organizator;
    }

    protected void saveMatchInCache(Match match) {
        String key = "match:" + match.getOrganizer().getEmail() + ":" + match.getUuid();
        redisTemplate.opsForValue().set(key, match, Duration.ofMinutes(10));
    }

    @Transactional(readOnly = true)
    protected Match findMatch(String uuid, String email) {
        String key = "match:" + email + ":" + uuid;
        Match match = objectMapper.convertValue(redisTemplate.opsForValue().get(key), Match.class);
        if (match == null) {
            match = matchRepository.findMatchByUuid(uuid).orElseThrow(() -> {
                throw new EntityNotFoundException("Матч не найден");
            });
        } else {
            match = entityManager.merge(match);
        }
        return match;
    }

    protected void deleteMatchFromCache(String uuid, String email) {
        String key = "match:" + email + ":" + uuid;
        redisTemplate.delete(key);
    }


}
