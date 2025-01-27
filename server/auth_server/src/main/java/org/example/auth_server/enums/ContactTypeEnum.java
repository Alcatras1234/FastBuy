package org.example.auth_server.enums;

public enum ContactTypeEnum {
    PHONE,
    EMAIL,
    FAX;

    @Override
    public String toString() {
        return name().toLowerCase();
    }
}
