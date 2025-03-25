package org.example.auth_server.model.actors;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.example.auth_server.annotationValidator.RoleEnumConverter;
import org.example.auth_server.annotationValidator.StatusEnumConverter;
import org.example.auth_server.enums.RoleEnum;
import org.example.auth_server.enums.StatusEnum;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username")
    private String username;

    @Column(name = "name")
    private String name;

    @Column(name = "surname")
    private String surname;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "password")
    private String password;

    @Column(name = "is_verify")
    private boolean isVerify = false;

    @Column(name = "role")
    @Convert(converter = RoleEnumConverter.class)
    private RoleEnum role;

    @Column(name = "status", nullable = false)
    @Convert(converter = StatusEnumConverter.class)
    private StatusEnum status;

    @Column(name = "created_dttm")
    private LocalDateTime createdDttm;

    @Column(name = "updated_dttm")
    private LocalDateTime updatedDttm;

    @Override
    public String toString() {

        return "Пользователь: " + this.email + " " + this.isVerify;
    }

}
