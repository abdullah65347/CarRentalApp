package com.example.carrental.util;

import org.springframework.stereotype.Component;

import java.security.SecureRandom;

@Component
public class UniqueIdGenerator {

     private final SecureRandom secureRandom = new SecureRandom();
     private static final char[] HEX = "0123456789abcdef".toCharArray();

     public String generate(String prefix) {
          while (true) {
               String hex = randomHex(8); // 8 bytes → 16 hex chars (64-bit)
               String id = prefix + "-" + hex;
               return id; // uniqueness check happens in service layer
          }
     }

     private String randomHex(int bytesLength) {
          byte[] bytes = new byte[bytesLength];
          secureRandom.nextBytes(bytes);
          char[] hexChars = new char[bytes.length * 2];

          for (int i = 0; i < bytes.length; i++) {
               int v = bytes[i] & 0xFF;
               hexChars[i * 2] = HEX[v >>> 4];
               hexChars[i * 2 + 1] = HEX[v & 0x0F];
          }

          return new String(hexChars);
     }
}
