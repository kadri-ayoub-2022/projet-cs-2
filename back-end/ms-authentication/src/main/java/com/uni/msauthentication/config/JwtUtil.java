package com.uni.msauthentication.config;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {
    private final String JWT_SECRET = "your_very_strong_secret_key_which_is_long_enough_to_be_secure_12345678901234567890";
    private final long JWT_EXPIRATION = 1000 * 60 * 60 * 24 * 20; // 20 days
    private final long RESET_TOKEN_EXPIRATION = 1000 * 60 * 60; // 1 hour

    public final Key key = Keys.hmacShaKeyFor(JWT_SECRET.getBytes());

    public String generateToken(String email, String role) {
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + JWT_EXPIRATION))
                .signWith(SignatureAlgorithm.HS512, key)
                .compact();
    }

    public String getEmailFromToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build()
                .parseClaimsJws(token).getBody().getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // for generating reset password token
    public String generateResetToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .claim("type", "reset") // Indicate this is a reset token
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + RESET_TOKEN_EXPIRATION))
                .signWith(SignatureAlgorithm.HS512, key)
                .compact();
    }

    public boolean isResetToken(String token) {
        try {
            Claims claims = Jwts.parserBuilder().setSigningKey(key).build()
                    .parseClaimsJws(token).getBody();
            return "reset".equals(claims.get("type", String.class));
        } catch (Exception e) {
            return false;
        }
    }

    public long extractExpiration(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            return claims.getExpiration().getTime();
        } catch (Exception e) {
            return 0; // Return 0 if the token is invalid or expired
        }
    }

    public Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }



}
