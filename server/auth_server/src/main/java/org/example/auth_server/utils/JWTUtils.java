package org.example.auth_server.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.experimental.UtilityClass;
import org.example.auth_server.model.User;

import java.security.Key;
import java.util.Date;

@UtilityClass
public class JWTUtils {
    private static final Key SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    public static String generateRefreshToken(User user) {
        long expirationTimeMillis = 7 * 24 * 60 * 60 * 1000; // неделя
        Date now = new Date();
        Date expirationDate = new Date(now.getTime() + expirationTimeMillis);
        return Jwts.builder()
                .setSubject(String.valueOf(user.getId()))
                .claim("email", user.getEmail())
                .setIssuedAt(now)
                .setExpiration(expirationDate)
                .signWith(SECRET_KEY)
                .compact();
    }

    public static String generateAccessToken(User user) {
        long expirationTimeMillis = 60 * 60 * 1000; // 15 минут
        Date now = new Date();
        Date expirationDate = new Date(now.getTime() + expirationTimeMillis);
        return Jwts.builder()
                .setSubject(String.valueOf(user.getId()))
                .claim("email", user.getEmail())
                .claim("role", user.getRole())
                .claim("username", user.getUsername())
                .claim("surname", user.getSurname())
                .setIssuedAt(now)
                .setExpiration(expirationDate)
                .signWith(SECRET_KEY)
                .compact();
    }

    public static String generateValidateToken(String email) {
        long expirationTimeMillis = 15 * 60 * 1000; // 15 минут
        Date now = new Date();
        Date expirationDate = new Date(now.getTime() + expirationTimeMillis);
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(now)
                .setExpiration(expirationDate)
                .signWith(SECRET_KEY)
                .compact();
    }

    public static Claims extractClaim(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token.replace("Bearer", ""))
                .getBody();
        return claims;
    }

    public static boolean validateToken(String token) {
        try {
            Claims claim = extractClaim(token);
            return !claim.getExpiration().before(new Date());
        } catch (Exception e) {
            return false;
        }
    }
}
