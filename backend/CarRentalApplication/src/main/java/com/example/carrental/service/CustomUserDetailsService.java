package com.example.carrental.service;

import com.example.carrental.model.User;
import com.example.carrental.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService implements UserDetailsService {

     private final UserRepository userRepository;

     public CustomUserDetailsService(UserRepository userRepository) {
          this.userRepository = userRepository;
     }

     @Override
     public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
          User user = userRepository.findByEmail(username)
                  .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));

          var authorities = user.getRoles().stream()
                  .map(r -> new SimpleGrantedAuthority(r.getName()))
                  .collect(Collectors.toList());

          return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPasswordHash(), user.getIsActive(), true, true, true, authorities);
     }
}