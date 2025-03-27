package com.uni.msauthentication.Controller;

import com.uni.msauthentication.DTO.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ser.FilterProvider;
import com.fasterxml.jackson.databind.ser.impl.SimpleBeanPropertyFilter;
import com.fasterxml.jackson.databind.ser.impl.SimpleFilterProvider;
import com.uni.msauthentication.DTO.AuthResponse;
import com.uni.msauthentication.DTO.ForgotPasswordRequest;
import com.uni.msauthentication.DTO.LoginRequest;
import com.uni.msauthentication.DTO.ResetPasswordRequest;
import com.uni.msauthentication.Exception.TokenExpiredException;
import com.uni.msauthentication.Proxies.UserProxy;
import com.uni.msauthentication.Service.AuthService;
import com.uni.msauthentication.Service.EmailService;
import com.uni.msauthentication.Service.TokenBlacklist;
import com.uni.msauthentication.config.JwtUtil;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.logging.Logger;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private static final Logger LOGGER = Logger.getLogger(AuthController.class.getName());

    private final UserProxy userProxy;
    private final AuthService authService;
    private final JwtUtil jwtUtil;
    private final TokenBlacklist tokenBlacklist;
    private final BCryptPasswordEncoder passwordEncoder;


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        String email = request.getEmail();
        String password = request.getPassword();
        Object user = authService.findUserByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }
        String storedPassword = authService.getPassword(user);
        String role = authService.getRole(user);

        if (!passwordEncoder.matches(password, storedPassword)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }

        String token = jwtUtil.generateToken(email, role);

        Object filteredUser = authService.filterUserWithoutPassword(user);
        if (filteredUser == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing user data");
        }

        return ResponseEntity.ok(new AuthResponse(token, filteredUser));
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            LOGGER.warning("No valid Bearer token provided for logout");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"message\": \"No valid token provided\"}");
        }

        String token = authHeader.substring(7);
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(jwtUtil.key)
                .build()
                .parseClaimsJws(token)
                .getBody();
        long expiration = claims.getExpiration().getTime();

        tokenBlacklist.blacklistToken(token, expiration);
        LOGGER.info("Token blacklisted: " + token.substring(0, 10) + "...");
        return ResponseEntity.ok("{\"message\": \"Logout successful. Token invalidated.\"}");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        authService.sendPasswordResetToken(request.getEmail());
        return ResponseEntity.ok("{\"message\": \"Password reset link sent\"}");
    }


    @PutMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam String token, @RequestBody ResetPasswordRequest request) {
        if (tokenBlacklist.isBlacklisted(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("This reset token has already been used.");
        }

        if (!jwtUtil.isResetToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
        }

        String email = jwtUtil.getEmailFromToken(token); // Extract email from token
        if (email == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid token");
        }

        // Update the password
        userProxy.updatePassword(email, passwordEncoder.encode(request.getNewPassword()));

        // Blacklist the token after successful reset
        long expiration = jwtUtil.extractExpiration(token);
        tokenBlacklist.blacklistToken(token, expiration);

        return ResponseEntity.ok("Password has been reset successfully.");
    }

    @GetMapping("/me")
    public ResponseEntity<?> getAuthenticatedUser(@RequestHeader("Authorization") String token) {
        try {
            token = token.replace("Bearer ", "");
            Claims claims = jwtUtil.extractAllClaims(token);
            String email = claims.getSubject();

            // Fetch user from DB based on role
            Object user = authService.findUserByEmail(email);

            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
            String role = authService.getRole(user);

            // to delete password filed from response
            Object filteredUser = authService.filterUserWithoutPassword(user);
            if (filteredUser == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing user data");
            }

            return ResponseEntity.ok(filteredUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }
    }
}


