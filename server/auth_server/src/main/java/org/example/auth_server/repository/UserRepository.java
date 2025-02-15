package org.example.auth_server.repository;

import org.example.auth_server.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findUserByEmail(String email);
    User findUserById(Long id);
    boolean existsByEmail(String email);
}
