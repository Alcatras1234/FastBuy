package org.example.auth_server.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

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
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

   @Column(name = "company_name")
   private String companyName;

   @Column(name = "contact_number")
   private String contactNumber;

   @Column(name = "approved")
   private boolean approved = false;

    @Column(name = "created_dttm", nullable = false, updatable = false)
    private LocalDateTime createdDttm = LocalDateTime.now();

    @Column(name = "updated_dttm")
    private LocalDateTime updatedDttm;

}
