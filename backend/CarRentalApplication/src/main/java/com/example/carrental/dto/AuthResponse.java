package com.example.carrental.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
public class AuthResponse {
     private String accessToken;
     private String tokenType = "Bearer";

     public AuthResponse(String accessToken) {
          this.accessToken = accessToken;
     }

}