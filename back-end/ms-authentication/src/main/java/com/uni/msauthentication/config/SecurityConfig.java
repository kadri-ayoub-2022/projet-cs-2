package com.uni.msauthentication.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
          //      .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Configure CORS
                .csrf(csrf -> csrf.disable()) // Disable CSRF for stateless API
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class) // Add JWT filter
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/login", "/auth/forgot-password", "/auth/reset-password").permitAll() // Public endpoints
                        .anyRequest().authenticated() // All other requests require authentication
                );

        return http.build();
    }

//    @Bean
//    public CorsConfigurationSource corsConfigurationSource() {
//        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        CorsConfiguration config = new CorsConfiguration();
//        config.setAllowCredentials(true); // Allow credentials (e.g., cookies, Authorization header)
//        config.addAllowedOrigin("http://localhost:5173"); // Allow Vite dev server
//        config.addAllowedHeader("*"); // Allow all headers
//        config.addAllowedMethod("*"); // Allow all HTTP methods
//        source.registerCorsConfiguration("/**", config); // Apply to all endpoints
//        return source;
//    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // this is for keycloak token , not important right now
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
