package org.example.msevaluationmonitoringproject.Controller;

import lombok.RequiredArgsConstructor;
import org.example.msevaluationmonitoringproject.DTO.ProjectThemeWithTasksDTO;
import org.example.msevaluationmonitoringproject.Services.ProjectService;
import org.example.msevaluationmonitoringproject.Services.ProjectThemeProgressionProducer;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/api/project")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;
    private final ProjectThemeProgressionProducer producer;

    @GetMapping("/themes-by-teacher")
    public ResponseEntity<List<ProjectThemeWithTasksDTO>> getProjectThemesWithTasks(
            @RequestHeader("Authorization") String token) {
        List<ProjectThemeWithTasksDTO> result = projectService.getThemesWithTasksByTeacher(token);
        return ResponseEntity.ok(result);
    }

    @GetMapping("themes-by-student")
    public ResponseEntity<ProjectThemeWithTasksDTO> getThemeWithTasksByStudent(@RequestHeader("Authorization") String token) {
        ProjectThemeWithTasksDTO themeWithTasks = projectService.getThemesWithTasksByStudent(token);
        return ResponseEntity.ok(themeWithTasks);
    }

    @PutMapping("/{projectId}")
    public ResponseEntity<String> updateProgression(
            @PathVariable Long projectId,
            @RequestParam String progression,
            @RequestHeader("Authorization") String token) {

        try {
            double progressionValue = Double.parseDouble(progression);
            return producer.sendProgressionUpdate(projectId, progressionValue, token);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred");
        }
    }

}
