package com.uni.msadministration.Services;

import com.uni.msadministration.Proxy.AuthProxy;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import org.example.coreapi.DTO.ProjectThemeDateUpdateEvent;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.ErrorResponseException;
import org.springframework.web.server.ResponseStatusException;

import java.util.Date;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ProjectThemeDateProducer {
    private final KafkaTemplate<String, ProjectThemeDateUpdateEvent> kafkaTemplate;
    private static final String TOPICDATE = "update-theme-date";
    private final AuthProxy authProxy;

    public ResponseEntity<String> sendStatusUpdate(Long themeId, Date dateB, Date dateE, String token) throws ErrorResponseException {
        ResponseEntity<?> response = null;

        try {
            response = authProxy.getAuthenticatedUser(token);
        } catch (FeignException.Unauthorized e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized: Invalid or expired token");
        }
        Object userResponse = response.getBody();
        Long adminId = extractAdminId(userResponse);


        ProjectThemeDateUpdateEvent event = new ProjectThemeDateUpdateEvent(themeId,dateB,dateE);
        kafkaTemplate.send(TOPICDATE, event);
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