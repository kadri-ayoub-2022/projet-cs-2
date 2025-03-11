package com.uni.msauthentication.config;

import com.uni.msauthentication.Exception.InvalidCredentialsException;
import com.uni.msauthentication.Exception.TokenExpiredException;
import com.uni.msauthentication.Exception.UserNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.logging.Logger;

@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger LOGGER = Logger.getLogger(GlobalExceptionHandler.class.getName());

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<String> handleInvalidCredentialsException(InvalidCredentialsException ex) {
        LOGGER.warning("Invalid credentials: " + ex.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("{\"message\": \"" + ex.getMessage() + "\"}");
    }

    @ExceptionHandler(TokenExpiredException.class)
    public ResponseEntity<String> handleTokenExpiredException(TokenExpiredException ex) {
        LOGGER.warning("Token error: " + ex.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("{\"message\": \"" + ex.getMessage() + "\"}");
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<String> handleUserNotFoundException(UserNotFoundException ex) {
        LOGGER.warning("User not found: " + ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"message\": \"" + ex.getMessage() + "\"}");
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<String> handleIllegalStateException(IllegalStateException ex) {
        LOGGER.severe("Illegal state: " + ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"message\": \"" + ex.getMessage() + "\"}");
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGenericException(Exception ex) {
        LOGGER.severe("Unexpected error: " + ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"message\": \"Internal server error\"}");
    }
}