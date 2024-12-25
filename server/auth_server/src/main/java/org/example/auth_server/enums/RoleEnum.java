package org.example.auth_server.enums;

public enum RoleEnum {
    ADMIN,
    USER,
    ORGANIZER;

    @Override
    public String toString() {
        return name().toLowerCase();
    }
}
