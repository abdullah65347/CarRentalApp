package com.example.carrental.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Setter
@Getter
@NoArgsConstructor
public class User {
     @Id
     @GeneratedValue(strategy = GenerationType.IDENTITY)
     private Long id;

     private String name;

     @Column(nullable = false, unique = true)
     private String email;

     @Column(name = "password_hash", nullable = false)
     private String passwordHash;

     private String phone;

     @Column(name = "is_active")
     private Boolean isActive = true;

     @Column(name = "created_at")
     private OffsetDateTime createdAt = OffsetDateTime.now();

     @ManyToMany(fetch = FetchType.EAGER)
     @JoinTable(name = "user_roles",
             joinColumns = @JoinColumn(name = "user_id"),
             inverseJoinColumns = @JoinColumn(name = "role_id"))
     private Set<Role> roles = new HashSet<>();

}