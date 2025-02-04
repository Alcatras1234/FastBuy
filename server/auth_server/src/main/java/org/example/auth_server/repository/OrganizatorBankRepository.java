package org.example.auth_server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrganizatorBankRepository extends JpaRepository<OrdanizerBankDetails, Long> {
}
