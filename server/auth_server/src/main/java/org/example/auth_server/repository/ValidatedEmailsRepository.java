package org.example.auth_server.repository;

import org.example.auth_server.model.ValidatedEmails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ValidatedEmailsRepository extends JpaRepository<ValidatedEmails, Long> {
    ValidatedEmails findValidatedEmailsByEmail(String email);
}
