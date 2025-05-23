package org.example.auth_server.repository;

import org.example.auth_server.model.actors.Organizator;
import org.example.auth_server.model.actors.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrganizatorRepository extends JpaRepository<Organizator, Long> {
    Optional<Organizator> findOrganizatorByUser(User user);
    Page<Organizator> findAll(Pageable pageable);
}
