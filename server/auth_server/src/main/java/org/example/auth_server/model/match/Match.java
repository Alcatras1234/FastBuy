package org.example.auth_server.model.match;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.example.auth_server.model.actors.User;
import org.springframework.data.jpa.convert.threeten.Jsr310JpaConverters;

import java.time.LocalDateTime;

@Entity
@Table(name = "matches")
@Getter
@Setter
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "league")
    private String league;

    @Column(name = "schedule_dt", nullable = false, length = 100)
    private String scheduleDate;

    @Column(name = "schedule_time_lcl", nullable = false, length = 100)
    private String scheduleTimeLocal;

    @Column(name = "stadium_name", length = 255)
    private String stadiumName;

    @Column(name = "uuid", length = 255)
    private String uuid;

    @Column(name = "tickets_cnt", nullable = false)
    private Integer ticketsCount;

    @Column(name = "info")
    private String info;

    @Column(name = "team_home_name", nullable = false, length = 255)
    private String teamHomeName;

    @Column(name = "team_away_name", nullable = false, length = 255)
    private String teamAwayName;

    @Column(name = "photo_url", length = 255)
    private String photoUrl;

    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "organizer_id", nullable = false)
    private User organizer;

    @Convert(converter = StatusConverter.class)
    @Column(name = "status", nullable = false, length = 50)
    private Status status;

    @Column(name = "created_dttm", updatable = false, nullable = false)
    private LocalDateTime createdDateTime;

    @Column(name = "updated_dttm", nullable = false)
    private LocalDateTime updatedDateTime;

    public enum Status {
        SCHEDULED("scheduled"),
        ONGOING("ongoing"),
        COMPLETED("completed"),
        CANCELLED("cancelled");

        private final String dbValue;

        Status(String dbValue) {
            this.dbValue = dbValue;
        }

        public String getDbValue() {
            return dbValue;
        }

        // Метод для преобразования из строки БД в enum
        public static Status fromDbValue(String dbValue) {
            for (Status status : values()) {
                if (status.dbValue.equalsIgnoreCase(dbValue)) {
                    return status;
                }
            }
            throw new IllegalArgumentException("Unknown status: " + dbValue);
        }
    }

}




