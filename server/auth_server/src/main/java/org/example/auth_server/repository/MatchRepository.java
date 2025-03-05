package org.example.auth_server.repository;

import org.example.auth_server.model.Match;
import org.example.auth_server.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface MatchRepository extends JpaRepository<Match, Long> {
    Page<Match> findMatchesByOrganizer(User user, Pageable pageable);

    @Query("SELECT m FROM Match m")
    Page<Match> findMatches(Pageable pageable);

    Optional<Match> findMatchByUuid(String uuid);

}
