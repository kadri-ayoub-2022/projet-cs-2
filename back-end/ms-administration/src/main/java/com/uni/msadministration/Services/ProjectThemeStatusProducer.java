package com.uni.msadministration.Services;

import com.uni.msadministration.Proxy.AuthProxy;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import org.example.coreapi.DTO.ProjectThemeStatusUpdateEvent;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.ErrorResponseException;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class ProjectThemeStatusProducer {
    private final KafkaTemplate<String, ProjectThemeStatusUpdateEvent> kafkaTemplate;
    private static final String TOPIC = "update-theme-status";
    private final AuthProxy authProxy;

    public ResponseEntity<String> sendStatusUpdate(Long themeId, boolean status, String token) throws ErrorResponseException {
        ResponseEntity<?> response = null;

        try {
            response = authProxy.getAuthenticatedUser(token);
        } catch (FeignException.Unauthorized e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized: Invalid or expired token");
        }
        Object userResponse = response.getBody();
        Long adminId = extractAdminId(userResponse);


        ProjectThemeStatusUpdateEvent event = new ProjectThemeStatusUpdateEvent(themeId, status);
        kafkaTemplate.send(TOPIC, event);
        return null;
    }

    private Long extractAdminId(Object userResponse) {
        if (userResponse instanceof Map) {
            Map<String, Object> userMap = (Map<String, Object>) userResponse;
            Object role = userMap.get("role");

            if (!"admin".equals(role)) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Only teachers can access this");
            } else {
                return ((Number) userMap.get("adminId")).longValue();
            }

        }
        throw new RuntimeException("Unexpected response format from authentication service");
    }
}