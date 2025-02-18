package org.example.auth_server.exeptions;

public class ExpiredJWTException extends Exception {
    public ExpiredJWTException(String message) {
        super(message);
    }
}
