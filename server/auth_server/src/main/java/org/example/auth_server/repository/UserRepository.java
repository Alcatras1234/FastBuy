package org.example.auth_server.repository;

import org.example.auth_server.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    User findUserByEmail(String email);
    User findUserById(Long id);
    boolean existsByEmail(String email);
}
