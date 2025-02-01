package org.example.auth_server.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "organizer_bank_details")
@Getter
@Setter
public class OrdanizerBankDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "legal_info_id", referencedColumnName = "id", nullable = false)
    private Organizator organizator;

    @Column(name = "bank_name")
    private String bankName;

    @Column(name = "account_number")
    private String routingNumber;

    @Column(name = "swift_code")
    private String swiftCode;

    @Column(name = "created_dttm")
    private LocalDateTime createdDttm;

    @Column(name = "updated_dttm")
    private LocalDateTime updated_dttm;
}
