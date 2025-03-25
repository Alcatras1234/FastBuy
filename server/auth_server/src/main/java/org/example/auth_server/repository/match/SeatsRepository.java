package org.example.auth_server.repository.match;

import org.example.auth_server.model.match.Seats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface SeatsRepository extends JpaRepository<Seats, Integer> {
    Optional<Seats> findSeatsBySeatNumber(String seatNumber);

    @Query("SELECT s FROM Seats s WHERE s.matchId.uuid = :uuid AND s.status = 'free'")
    List<Seats> getSeatsByMatchId(@Param("uuid") String uuid);
}
