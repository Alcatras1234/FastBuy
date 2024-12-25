package org.example.auth_server.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "otgpassword")
@Getter
@Setter
public class OTGPassword {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "password", nullable = false)
    private String otgpassword;

    @Column(name = "expired")
    private LocalDateTime expired;

    @Column(name = "validate")
    private boolean validate;
}
