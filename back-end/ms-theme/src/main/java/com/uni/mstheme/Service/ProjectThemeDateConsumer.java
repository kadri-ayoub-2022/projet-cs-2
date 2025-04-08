package com.uni.mstheme.Service;

import com.uni.mstheme.Entities.ProjectTheme;
import com.uni.mstheme.Repository.ProjectThemeRepository;
import lombok.RequiredArgsConstructor;
import org.example.coreapi.DTO.ProjectThemeDateUpdateEvent;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor

public class ProjectThemeDateConsumer   {
    private final ProjectThemeRepository projectThemeRepository;

    @KafkaListener(topics = "update-theme-date", groupId = "theme-group")
    public void updateProjectThemeDate(ProjectThemeDateUpdateEvent event) {
        Optional<ProjectTheme> optionalProjectTheme = projectThemeRepository.findById(event.getThemeId());
        if (optionalProjectTheme.isPresent()) {
            ProjectTheme projectTheme = optionalProjectTheme.get();
            projectTheme.setDate_selection_begin(event.getDate_selection_begin());
            projectTheme.setDate_selection_end(event.getDate_selection_end());
            projectThemeRepository.save(projectTheme);
        }
    }
}
