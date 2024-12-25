package org.example.auth_server.repository;

import org.example.auth_server.model.OTGPassword;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OTGPasswordRepository extends JpaRepository<OTGPassword, Integer> {
    OTGPassword findByOtgpassword(String otgpassword);
    void deleteByOtgpassword(String otgpassword);
}
