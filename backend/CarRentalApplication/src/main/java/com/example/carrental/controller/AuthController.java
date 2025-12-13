package com.example.carrental.controller;

import com.example.carrental.dto.AuthResponse;
import com.example.carrental.dto.LoginRequest;
import com.example.carrental.dto.RegisterRequest;
import com.example.carrental.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

     private final AuthService authService;

     public AuthController(AuthService authService) {
          this.authService = authService;
     }

     @PostMapping("/register")
     public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
          authService.register(request);
          return ResponseEntity.status(HttpStatus.CREATED).build();
     }
     @PostMapping("/register-owner")
     public ResponseEntity<?> registerOwner(@Valid @RequestBody RegisterRequest request) {
          authService.registerOwner(request);
          return ResponseEntity.status(HttpStatus.CREATED).build();
     }


     @PostMapping("/login")
     public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
          AuthResponse response = authService.login(request);
          return ResponseEntity.ok(response);
     }

     @GetMapping("/me")
     public ResponseEntity<?> getCurrentUser() {
          var auth = SecurityContextHolder.getContext().getAuthentication();
          System.out.println("AUTH NAME = " + auth.getName());
          return ResponseEntity.ok(authService.getCurrentUser());
     }
}