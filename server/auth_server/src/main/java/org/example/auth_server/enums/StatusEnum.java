package org.example.auth_server.enums;

public enum StatusEnum {
    ACTIVE,
    INACTIVE,
    SUSPENDED;

    @Override
    public String toString() {
        return name().toLowerCase();
    }
}
