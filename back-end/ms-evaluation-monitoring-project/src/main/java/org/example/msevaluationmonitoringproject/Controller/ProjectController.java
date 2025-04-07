package org.example.msevaluationmonitoringproject.Controller;

import lombok.RequiredArgsConstructor;
import org.example.msevaluationmonitoringproject.DTO.ProjectThemeWithTasksDTO;
import org.example.msevaluationmonitoringproject.Services.ProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/project")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping("/themes-by-teacher")
    public ResponseEntity<List<ProjectThemeWithTasksDTO>> getProjectThemesWithTasks(
            @RequestHeader("Authorization") String token) {
        List<ProjectThemeWithTasksDTO> result = projectService.getThemesWithTasksByTeacher(token);
        return ResponseEntity.ok(result);
    }
}
