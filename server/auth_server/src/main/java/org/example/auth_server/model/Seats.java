package org.example.auth_server.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.math.BigDecimal;

@Entity
@Table(name="seats")
@Getter
@Setter
public class Seats {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="row")
    private Integer row;

    @Column(name = "sector")
    private String sector;

    @ManyToOne
    @JoinColumn(name = "match_id", nullable = false)
    private Match matchId;

    @Column(name = "price")
    private BigDecimal price;

    @ManyToOne
    @JoinColumn(name = "stadium_id", nullable = false)
    private Stadium stadiumId;

    @Column(name = "status")
    private String status;
}
