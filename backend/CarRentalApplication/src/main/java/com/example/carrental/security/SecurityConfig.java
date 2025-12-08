package com.example.carrental.security;

import com.example.carrental.service.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

     private final JwtUtil jwtUtil;
     private final CustomUserDetailsService userDetailsService;

     public SecurityConfig(JwtUtil jwtUtil, CustomUserDetailsService userDetailsService) {
          this.jwtUtil = jwtUtil;
          this.userDetailsService = userDetailsService;
     }

     @Bean
     public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
          var jwtFilter = new JwtAuthenticationFilter(jwtUtil, userDetailsService);

          http
                  .csrf(csrf -> csrf.disable())
                  .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                  .authorizeHttpRequests(authorize -> authorize
                          .requestMatchers("/api/auth/**", "/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                          .anyRequest().authenticated()
                  )
                  .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

          return http.build();
     }

     @Bean
     public PasswordEncoder passwordEncoder() {
          return new BCryptPasswordEncoder();
     }

     @Bean
     public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
          return authConfig.getAuthenticationManager();
     }
}
