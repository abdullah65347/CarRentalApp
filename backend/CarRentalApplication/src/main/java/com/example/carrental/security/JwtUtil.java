package com.example.carrental.security;

import com.example.carrental.exception.BadRequestException;
import com.example.carrental.exception.ResourceNotFoundException;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.stream.Collectors;

@Component
public class JwtUtil {

     private final SecretKey key;
     private final long expirationMs;

     public JwtUtil(@Value("${app.jwt.secret}") String secret,
                    @Value("${app.jwt.expiration-ms}") long expirationMs) {
          this.expirationMs = expirationMs;
          this.key = buildKey(secret);
     }

     private SecretKey buildKey(String secret) {
          if (secret == null || secret.isBlank()) {
               throw new BadRequestException("JWT secret (app.jwt.secret) is not set. Add a strong secret in application.yml");
          }

          // If secret looks like Base64 (only valid base64 chars and length multiple of 4), decode it
          try {
               byte[] decoded = Decoders.BASE64.decode(secret);
               if (decoded.length >= 32) {
                    return Keys.hmacShaKeyFor(decoded);
               }
          } catch (Exception ignored) {
               // not base64 or decode failed; fall back to raw bytes below
          }

          byte[] bytes = secret.getBytes(StandardCharsets.UTF_8);
          if (bytes.length < 32) {
               // meaningful error to help debugging
               throw new BadRequestException("JWT secret is too short. For HS256 the key must be at least 256 bits (32 bytes). "
                       + "Use a 32+ char secret or a Base64-encoded 32+ byte key.");
          }
          return Keys.hmacShaKeyFor(bytes);
     }

     public String generateToken(org.springframework.security.core.Authentication authentication) {
          var user = (org.springframework.security.core.userdetails.User) authentication.getPrincipal();
          var now = new Date();
          var expiry = new Date(now.getTime() + expirationMs);
          String roles = user.getAuthorities().stream()
                  .map(a -> a.getAuthority()).collect(Collectors.joining(","));

          return Jwts.builder()
                  .setSubject(user.getUsername())
                  .claim("roles", roles)
                  .setIssuedAt(now)
                  .setExpiration(expiry)
                  .signWith(key, SignatureAlgorithm.HS256)
                  .compact();
     }

     public String getUsernameFromToken(String token) {
          return Jwts.parserBuilder().setSigningKey(key).build()
                  .parseClaimsJws(token).getBody().getSubject();
     }

     public boolean validateToken(String token) {
          try {
               Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
               return true;
          } catch (JwtException | ResourceNotFoundException ex) {
               // you can log ex here for debugging
               return false;
          }
     }
}
