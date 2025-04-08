package com.uni.mstheme.Service;

import com.uni.mstheme.Entities.ProjectTheme;
import com.uni.mstheme.Repository.ProjectThemeRepository;
import lombok.RequiredArgsConstructor;
import org.example.coreapi.DTO.ProjectThemeProgressionUpdateEvent;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProjectThemeProgressionConsumer {
    private final ProjectThemeRepository projectThemeRepository;

    @KafkaListener(topics = "update-theme-progression", groupId = "theme-group")
    public void updateProjectThemeProgression(ProjectThemeProgressionUpdateEvent event) {
        Optional<ProjectTheme> optionalProjectTheme = projectThemeRepository.findById(event.getThemeId());
        if (optionalProjectTheme.isPresent()) {
            ProjectTheme projectTheme = optionalProjectTheme.get();
            projectTheme.setProgression(event.getProgression());
            projectThemeRepository.save(projectTheme);
        }
    }
}
