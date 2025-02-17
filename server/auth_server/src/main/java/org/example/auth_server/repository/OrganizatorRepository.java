package org.example.auth_server.repository;

import org.example.auth_server.model.Organizator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrganizatorRepository extends JpaRepository<Organizator, Long> {
    Organizator findOrganizatorById(Long id);
}
