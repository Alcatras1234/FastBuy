package org.example.auth_server.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.example.auth_server.enums.ContactTypeEnum;

import java.time.LocalDateTime;

@Entity
@Table(name = "organizer_legal_info")
@Getter
@Setter
public class Organizator {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", insertable = false, updatable = false)
    private User user;

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(name = "registration_number", unique = true, nullable = false)
    private String registrationNumber;

    @Column(name = "tax_id", unique = true, nullable = false)
    private String taxId;

    @Column(name = "legal_address", nullable = false, length = 255)
    private String legalAddress;

    @Column(name = "postal_code", nullable = false, length = 20)
    private String postalCode;

    @Column(name = "contact_type", nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private ContactTypeEnum contactType;

    @Column(name = "contact_value", nullable = false, length = 255)
    private String contactValue;

    @Column(name = "is_primary", nullable = false)
    private Boolean isPrimary = false;

    @Column(name = "created_dttm", nullable = false, updatable = false)
    private LocalDateTime createdDttm;

    @Column(name = "updated_dttm")
    private LocalDateTime updatedDttm;

}
