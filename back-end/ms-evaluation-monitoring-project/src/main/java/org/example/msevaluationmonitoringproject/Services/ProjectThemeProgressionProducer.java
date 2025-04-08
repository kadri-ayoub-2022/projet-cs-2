package org.example.msevaluationmonitoringproject.Services;

import feign.FeignException;
import lombok.RequiredArgsConstructor;
import org.example.coreapi.DTO.ProjectThemeProgressionUpdateEvent;
import org.example.msevaluationmonitoringproject.Proxy.AuthProxy;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.ErrorResponseException;
import org.springframework.web.server.ResponseStatusException;


import java.util.Map;

@Service
@RequiredArgsConstructor
public class ProjectThemeProgressionProducer {
    private final KafkaTemplate<String, ProjectThemeProgressionUpdateEvent> kafkaTemplate;
    private static final String TOPICPROGRESSION = "update-theme-progression";
    private final AuthProxy authProxy;

    public ResponseEntity<String> sendProgressionUpdate(Long themeId, double progression, String token) throws ErrorResponseException {
        ResponseEntity<?> response = null;

        try {
            response = authProxy.getAuthenticatedUser(token);
        } catch (FeignException.Unauthorized e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized: Invalid or expired token");
        }
        Object userResponse = response.getBody();
        Long teacherId = extractTeacherId(userResponse);


        ProjectThemeProgressionUpdateEvent event = new ProjectThemeProgressionUpdateEvent(themeId,progression);
        kafkaTemplate.send(TOPICPROGRESSION, event);
        return ResponseEntity.status(HttpStatus.CREATED).body("progression updated");
    }

    private Long extractTeacherId(Object userResponse) {
        if (userResponse instanceof Map) {
            Map<String, Object> userMap = (Map<String, Object>) userResponse;
            Object role = userMap.get("role");

            if (!"teacher".equals(role)) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Only teachers can access this");
            } else {
                return ((Number) userMap.get("teacherId")).longValue();
            }

        }
        throw new RuntimeException("Unexpected response format from authentication service");
    }

}
