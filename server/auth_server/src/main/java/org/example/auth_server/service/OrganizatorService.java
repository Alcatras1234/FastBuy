package org.example.auth_server.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.extern.log4j.Log4j2;
import org.example.auth_server.dto.ContactOrgInfoForApproveRequest;
import org.example.auth_server.dto.ContactOrganizatorInfoRequest;
import org.example.auth_server.model.Organizator;
import org.example.auth_server.model.User;
import org.example.auth_server.repository.OrganizatorRepository;
import org.example.auth_server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;

@Service
@Log4j2
public class OrganizatorService {

    private final OrganizatorRepository organizatorRepository;
    private final UserRepository userRepository;

    private final RedisTemplate redisTemplate;


    @Autowired
    public OrganizatorService(OrganizatorRepository organizatorRepository, UserRepository userRepository, RedisTemplate redisTemplate) {
        this.organizatorRepository = organizatorRepository;
        this.userRepository = userRepository;
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
    public Organizator getOrganizator(ContactOrgInfoForApproveRequest info) {
        log.info("Начал процесс GET информации организатора: " + info.getEmail());
        Organizator organizator = null;
        String key = "organizator:" + info.getEmail();
        organizator = (Organizator) redisTemplate.opsForValue().get(key);

        if (organizator == null) {

            organizator = organizatorRepository.findOrganizatorByEmail(info.getEmail()).orElseThrow(() -> {
                throw new EntityNotFoundException("Организатор не найден не найден");
            });

        }

        log.info("Закончил процесс GET информации организатора: " + info.getEmail());
        return organizator;

    }

    @Transactional
    public void changeApproveState(ContactOrgInfoForApproveRequest info) {
        log.info("Начал процесс APPROVE информации организатора: " + info.getEmail());
        String key = "organizator:" + info.getEmail();
        Organizator organizator = null;
        organizator = (Organizator) redisTemplate.opsForValue().get(key);

        if (organizator == null) {

            organizator = organizatorRepository.findOrganizatorByEmail(info.getEmail()).orElseThrow(() -> {
                throw new EntityNotFoundException("Организатор не найден не найден");
            });

        }

        organizator.setApproved(true);
        organizator.setUpdatedDttm(LocalDateTime.now());
        organizatorRepository.save(organizator);
        redisTemplate.opsForValue().set(key, organizator, Duration.ofMinutes(10));
        log.info("Закончил процесс APPROVE информации орагнизатора: " + info.getEmail());
    }


}
