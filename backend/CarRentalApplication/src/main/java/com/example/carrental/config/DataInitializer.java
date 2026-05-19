package com.example.carrental.config;

import com.example.carrental.model.Role;
import com.example.carrental.model.User;
import com.example.carrental.repository.RoleRepository;
import com.example.carrental.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

     private final UserRepository userRepository;
     private final RoleRepository roleRepository;
     private final PasswordEncoder passwordEncoder;

     @Override
     public void run(String... args) {
          // Create roles if not exists
          Role userRole = roleRepository.findByName("ROLE_USER")
                  .orElseGet(() -> roleRepository.save(new Role("ROLE_USER")));

          Role ownerRole = roleRepository.findByName("ROLE_OWNER")
                  .orElseGet(() -> roleRepository.save(new Role("ROLE_OWNER")));

          Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                  .orElseGet(() -> roleRepository.save(new Role("ROLE_ADMIN")));

          // Create default admin
          if (!userRepository.existsByEmail("admin@gmail.com")) {

               User admin = new User();
               admin.setName("Admin");
               admin.setEmail("admin@gmail.com");
               admin.setPasswordHash(passwordEncoder.encode("admin123"));
               admin.setPhone("9999999999");
               admin.setIsActive(true);
               admin.setRoles(Set.of(adminRole));

               userRepository.save(admin);

               System.out.println("Default admin created");
          }
     }
}