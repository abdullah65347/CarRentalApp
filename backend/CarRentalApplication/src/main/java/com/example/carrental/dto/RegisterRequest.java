package com.example.carrental.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
public class RegisterRequest {
     @NotBlank
     private String name;

     @Email
     @NotBlank
     private String email;

     @NotBlank
     @Size(min = 6, message = "Password must be at least 6 characters")
     private String password;

     private String phone;
}