package com.example.carrental.service;

import com.example.carrental.dto.AuthResponse;
import com.example.carrental.dto.LoginRequest;
import com.example.carrental.dto.RegisterRequest;
import com.example.carrental.dto.UserDto;
import com.example.carrental.model.Role;
import com.example.carrental.model.User;
import com.example.carrental.repository.RoleRepository;
import com.example.carrental.repository.UserRepository;
import com.example.carrental.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class AuthService {
     private final UserRepository userRepository;
     private final RoleRepository roleRepository;
     private final PasswordEncoder passwordEncoder;
     private final AuthenticationManager authenticationManager;
     private final JwtUtil jwtUtil;

     public AuthService(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder,
                        AuthenticationManager authenticationManager, JwtUtil jwtUtil) {
          this.userRepository = userRepository;
          this.roleRepository = roleRepository;
          this.passwordEncoder = passwordEncoder;
          this.authenticationManager = authenticationManager;
          this.jwtUtil = jwtUtil;
     }

     @Transactional
     public void register(RegisterRequest request) {
          if (userRepository.existsByEmail(request.getEmail())) {
               throw new IllegalArgumentException("Email already in use");
          }

          User user = new User();
          user.setName(request.getName());
          user.setEmail(request.getEmail());
          user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
          user.setPhone(request.getPhone());

          // assign ROLE_USER by default
          Role userRole = roleRepository.findByName("ROLE_USER").orElseGet(() -> roleRepository.save(new Role("ROLE_USER")));
          Set<Role> roles = new HashSet<>();
          roles.add(userRole);
          user.setRoles(roles);

          userRepository.save(user);
     }

     @Transactional
     public void registerOwner(RegisterRequest request) {
          if (userRepository.existsByEmail(request.getEmail())) {
               throw new IllegalArgumentException("Email already in use");
          }
          User user = new User();
          user.setName(request.getName());
          user.setEmail(request.getEmail());
          user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
          user.setPhone(request.getPhone());

          Role ownerRole = roleRepository.findByName("ROLE_OWNER")
                  .orElseThrow(() -> new RuntimeException("ROLE_OWNER not found"));

          user.setRoles(Set.of(ownerRole));
          userRepository.save(user);
     }

     public AuthResponse login(LoginRequest request) {
          var authToken = new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword());
          var auth = authenticationManager.authenticate(authToken);
          String token = jwtUtil.generateToken(auth);
          return new AuthResponse(token);
     }

     public UserDto getCurrentUser() {
          var authentication = SecurityContextHolder.getContext().getAuthentication();

          if (authentication == null || !authentication.isAuthenticated()) {
               throw new RuntimeException("User not authenticated");
          }
          String email = authentication.getName();
          User user = userRepository.findByEmail(email)
                  .orElseThrow(() -> new RuntimeException("User not found: " + email));
          // Extract role names
          List<String> roleNames = user.getRoles().stream()
                  .map(Role::getName)  // ROLE_USER / ROLE_OWNER / ROLE_ADMIN
                  .toList();

          return new UserDto(
                  user.getId(),
                  user.getName(),
                  user.getEmail(),
                  roleNames
          );
     }


}