package org.example.auth_server.repository;

import io.lettuce.core.dynamic.annotation.Param;
import org.example.auth_server.model.Seats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.awt.print.Pageable;
import java.util.List;

@Repository
public interface SeatsRepository extends JpaRepository<Seats, Integer> {
    @Query("SELECT s FROM Seats s WHERE s.status = :status ORDER BY s.id ASC LIMIT :count")
    List<Seats> findTopNSeatsByStatus(@Param("status") String status, @Param("count") int count);

}
