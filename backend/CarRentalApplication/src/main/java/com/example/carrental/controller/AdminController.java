package com.example.carrental.controller;

import com.example.carrental.exception.ResourceNotFoundException;
import com.example.carrental.model.User;
import com.example.carrental.repository.RoleRepository;
import com.example.carrental.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

/**
 * Admin endpoints. Only accessible to users with ROLE_ADMIN.
 */
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class AdminController {

     private final UserRepository userRepository;
     private final RoleRepository roleRepository;

     public AdminController(UserRepository userRepository, RoleRepository roleRepository) {
          this.userRepository = userRepository;
          this.roleRepository = roleRepository;
     }

     @GetMapping("/users")
     public ResponseEntity<List<User>> listUsers() {
          List<User> users = userRepository.findAll();
          return ResponseEntity.ok(users);
     }

     /**
      * Replace roles for a user (roles provided as comma-separated names e.g. ROLE_USER,ROLE_OWNER)
      * In production you'd accept a JSON array and validate roles exist.
      */
     @PutMapping("/users/{id}/roles")
     public ResponseEntity<Void> setUserRoles(@PathVariable("id") Long id,
                                              @RequestParam("roles") String rolesCsv) {
          User u = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
          Set<String> roleNames = java.util.Arrays.stream(rolesCsv.split(",")).map(String::trim).collect(java.util.stream.Collectors.toSet());
          var roles = roleRepository.findAll().stream().filter(r -> roleNames.contains(r.getName())).collect(java.util.stream.Collectors.toSet());
          if (roles.isEmpty()) throw new ResourceNotFoundException("No valid roles provided");
          u.setRoles(roles);
          userRepository.save(u);
          return ResponseEntity.ok().build();
     }
}
