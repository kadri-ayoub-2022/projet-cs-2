package com.uni.mstheme.Service;

import com.uni.mstheme.Entities.ProjectTheme;
import com.uni.mstheme.Repository.ProjectThemeRepository;
import lombok.RequiredArgsConstructor;
import org.example.coreapi.DTO.ProjectThemeStatusUpdateEvent;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProjectThemeStatusConsumer {
    private final ProjectThemeRepository projectThemeRepository;

    @KafkaListener(topics = "update-theme-status", groupId = "theme-group")
    public void updateProjectThemeStatus(ProjectThemeStatusUpdateEvent event) {
        Optional<ProjectTheme> optionalProjectTheme = projectThemeRepository.findById(event.getThemeId());
        if (optionalProjectTheme.isPresent()) {
            ProjectTheme projectTheme = optionalProjectTheme.get();
            projectTheme.setStatus(event.isStatus());
            projectThemeRepository.save(projectTheme);
            System.out.println("Updated ProjectTheme ID " + event.getThemeId() + " to status: " + event.isStatus());
        }
    }
}
