package com.photo_contest.utils;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.Claims;
import lombok.Getter;
import org.springframework.stereotype.Component;

import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Component
public class JwtUtil {

    private static final long ACCESS_TOKEN_VALIDITY = 15 * 60 * 1000;
    private static final long REFRESH_TOKEN_VALIDITY = 7 * 24 * 60 * 60 * 1000L;
    private final RSAPrivateKey privateKey;
    private final RSAPublicKey publicKey;

    public JwtUtil(RSAKeyProps keyProps) {
        this.privateKey = keyProps.getPrivateKey();
        this.publicKey = keyProps.getPublicKey();
    }


    public String generateAccessToken(String username, Long userId, List<String> roles, String rank) {
        return Jwts.builder()
                .setSubject(username)
                .claim("userId", userId)
                .claim("roles", roles)
                .claim("rank", rank)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_VALIDITY))
                .signWith(privateKey, SignatureAlgorithm.RS256)
                .compact();
    }


    public String generateRefreshToken(String username, Long userId) {
        return Jwts.builder()
                .setSubject(username)
                .claim("userId", userId)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + REFRESH_TOKEN_VALIDITY))
                .signWith(privateKey, SignatureAlgorithm.RS256)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(publicKey).build().parseClaimsJws(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }

    public String getUsernameFromToken(String token) {
        Claims claims = Jwts.parserBuilder().setSigningKey(publicKey).build().parseClaimsJws(token).getBody();
        return claims.getSubject();
    }

    public Long getUserIdFromToken(String token) {
        Claims claims = Jwts.parserBuilder().setSigningKey(publicKey).build().parseClaimsJws(token).getBody();
        return Long.parseLong(claims.get("userId").toString());
    }

    public List<String> getRolesFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(publicKey)
                .build()
                .parseClaimsJws(token)
                .getBody();

        // TODO
        Object roles = claims.get("roles");

        if (roles instanceof List<?>) {

            return ((List<?>) roles).stream()
                    .filter(role -> role instanceof String)
                    .map(Object::toString)
                    .collect(Collectors.toList());
        }

        return null;
    }
}
