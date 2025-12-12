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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.List;

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
     public SecurityFilterChain filterChain(HttpSecurity http, CorsConfigurationSource corsConfigurationSource) throws Exception {
          var jwtFilter = new JwtAuthenticationFilter(jwtUtil, userDetailsService);

          http
                  // use the provided CorsConfigurationSource explicitly (modern style)
                  .cors(cors -> cors.configurationSource(corsConfigurationSource))
                  .csrf(csrf -> csrf.disable())
                  .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                  .authorizeHttpRequests(authorize -> authorize
                          .requestMatchers("/api/auth/**", "/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html", "/uploads/**").permitAll()
                          .anyRequest().authenticated()
                  )
                  .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

          return http.build();
     }

     @Bean
     public CorsConfigurationSource corsConfigurationSource() {
          CorsConfiguration config = new CorsConfiguration();
          // exact origin(s) — DO NOT use "*" when allowCredentials = true
          config.setAllowedOrigins(List.of("http://localhost:5173"));
          config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
          config.setAllowedHeaders(List.of("*"));
          config.setAllowCredentials(true);
          // optional: expose headers like Authorization if you need them on client
          config.setExposedHeaders(List.of("Authorization", "Content-Disposition"));

          UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
          // apply to API endpoints; you can use "/**" to cover all routes
          source.registerCorsConfiguration("/api/**", config);
          return source;
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
