package org.example.auth_server.repository.match;

import org.example.auth_server.model.actors.User;
import org.example.auth_server.model.match.Match;
import org.example.auth_server.model.match.Ticket;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    Page<Ticket> findTicketsByUser(Pageable pageable, User user);
    Optional<Ticket> getTicketById(Long id);

    Optional<List<Ticket>> findAllByMatchUuid(String matchUuid);
}
