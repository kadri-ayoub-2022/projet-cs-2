package com.uni.msauthentication.config;

import com.uni.msauthentication.Service.TokenBlacklist;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.logging.Logger;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger LOGGER = Logger.getLogger(JwtAuthenticationFilter.class.getName());

    private final JwtUtil jwtUtil;
    private final TokenBlacklist tokenBlacklist; // Inject the blacklist service

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {
        String header = request.getHeader("Authorization");

        if (header == null || !header.startsWith("Bearer ")) {
            LOGGER.info("No Bearer token found in request, proceeding without authentication");
            filterChain.doFilter(request, response);
            return;
        }

        String token = header.substring(7);
        LOGGER.info("Validating token: " + token.substring(0, 10) + "...");

        // Check if token is blacklisted before validating
        if (tokenBlacklist.isBlacklisted(token)) {
            LOGGER.warning("Token is blacklisted: " + token.substring(0, 10) + "...");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        if (jwtUtil.validateToken(token)) {
            String email = jwtUtil.getEmailFromToken(token);

            // Extract role from token claims
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(jwtUtil.key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            String role = claims.get("role", String.class);
            LOGGER.info("Token validated for email: " + email + ", role: " + role);

            List<GrantedAuthority> authorities = Collections.singletonList(
                    new SimpleGrantedAuthority("ROLE_" + role)
            );

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            email,
                            null,
                            authorities
                    );

            SecurityContextHolder.getContext().setAuthentication(authentication);
        } else {
            LOGGER.warning("Invalid token: " + token.substring(0, 10) + "...");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        filterChain.doFilter(request, response);
    }
}
