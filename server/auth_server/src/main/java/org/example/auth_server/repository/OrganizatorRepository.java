package org.example.auth_server.repository;

import org.example.auth_server.model.Organizator;
import org.example.auth_server.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrganizatorRepository extends JpaRepository<Organizator, Long> {
    Optional<Organizator> findOrganizatorByUser(User user);
}
