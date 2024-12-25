package org.example.auth_server.repository;

import org.example.auth_server.model.JWTTokens;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JWTTokensRepository extends JpaRepository<JWTTokens, Long> {
    JWTTokens findJWTTokensByRefreshToken(String refreshToken);
}
