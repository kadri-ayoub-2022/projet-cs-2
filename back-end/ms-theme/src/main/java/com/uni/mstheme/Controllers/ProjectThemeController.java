package com.uni.mstheme.Controllers;

import com.uni.mstheme.DTO.*;
import com.uni.mstheme.Entities.ProjectTheme;
import com.uni.mstheme.Exception.InvalidRequestException;
import com.uni.mstheme.Exception.UnauthorizedException;
import com.uni.mstheme.Proxy.AdminProxy;
import com.uni.mstheme.Repository.ProjectThemeRepository;
import com.uni.mstheme.Service.ProjectThemeService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/project-themes")
@RequiredArgsConstructor
public class ProjectThemeController {

    private final ProjectThemeService projectThemeService;
    private final ProjectThemeRepository projectThemeRepository;
    private final AdminProxy adminProxy;


    @PostMapping
    public ResponseEntity<?> createProjectTheme(@RequestBody ProjectThemeRequest request, @RequestHeader("Authorization") String token) {
        try {
            ProjectTheme projectTheme = projectThemeService.createProjectTheme(request, token);
            return ResponseEntity.status(HttpStatus.CREATED).body(projectTheme);
        } catch (InvalidRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());

        }
    }



    @GetMapping("/my-themes")
    public ResponseEntity<?> getProjectThemes(@RequestHeader("Authorization") String token) {
        try {
            List<ProjectTheme> projectThemes = projectThemeService.getProjectThemesByToken(token);
            return ResponseEntity.ok(projectThemes);
        } catch (UnauthorizedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token.");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No project themes found.");
        }
    }

    @PostMapping("/project-selection-date")
    public ResponseEntity<String> defineProjectSelectionDate(@RequestBody ProjectSelectionDateRequest request, @RequestHeader("Authorization") String token) {
        projectThemeService.defineProjectSelectionDate(request, token);
        return ResponseEntity.ok("Project selection date set successfully.");
    }

    @PutMapping("/project-assignments/{themeId}")
    public ResponseEntity<String> validateProjectAssignment(@PathVariable("themeId") Long themeId, @RequestBody ProjectThemeValidationRequest request, @RequestHeader("Authorization") String token) {
        projectThemeService.validateProjectAssignment(themeId, request, token);
        return ResponseEntity.ok("Theme validated successfully.");
    }

    @DeleteMapping("/{themeId}")
    public ResponseEntity<String> deleteProjectTheme(@PathVariable Long themeId, @RequestHeader("Authorization") String token) {
        try {
            projectThemeService.deleteProjectTheme(themeId, token);
            return ResponseEntity.ok("Project theme deleted successfully.");
        } catch (UnauthorizedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You are not authorized to delete this theme.");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Project theme not found.");
        }
    }

    @PutMapping("/{themeId}")
    public ResponseEntity<?> updateProjectTheme(@PathVariable Long themeId, @RequestBody ProjectThemeRequest request, @RequestHeader("Authorization") String token) {
        try {
            ProjectTheme updatedTheme = projectThemeService.updateProjectTheme(themeId, request, token);
            return ResponseEntity.ok(updatedTheme);
        } catch (UnauthorizedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Project theme not found.");
        } catch (InvalidRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/unassigned")
    public ResponseEntity<List<ProjectTheme>> getUnassignedProjectThemes() {
        List<ProjectTheme> unassignedThemes = projectThemeService.getUnassignedProjectThemes();
        return ResponseEntity.ok(unassignedThemes);
    }

    @GetMapping("/Finished")
    public ResponseEntity<List<ProjectTheme>> getFinishedProjectThemes(@RequestHeader("Authorization") String token) {
        List<ProjectTheme> FinishedThemes = projectThemeService.getFinishedProjectThemes(token);
        return ResponseEntity.ok(FinishedThemes);
    }

    // I want you here to create a controller that update progression of ProjectTheme
    // direcly in the controller without using projectService
    @PutMapping("/{themeId}/progression")
    public ResponseEntity<?> updateProgression(@PathVariable Long themeId, @RequestParam double progression) {
        ProjectTheme projectTheme = projectThemeRepository.findById(themeId)
                .orElseThrow(() -> new EntityNotFoundException("Project theme not found"));

        projectTheme.setProgression(progression);
        projectThemeRepository.save(projectTheme);

        return ResponseEntity.ok("Progression updated successfully");
    }


    @GetMapping("/by-student/{studentId}")
    public ResponseEntity<?> getThemeByStudentId(@PathVariable Long studentId) {
        return projectThemeService.getThemeByStudentId(studentId)
                .map(theme -> ResponseEntity.ok().body(theme))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/with-details")
    public List<AllThemesDTO> getAllThemesWithDetails() {
        List<ProjectTheme> themes = projectThemeRepository.findAll();

        return themes.stream().map(theme -> {
            TeacherDTO teacher = adminProxy.getTeacher(theme.getTeacherId());

            List<SpecialtyDTO> specialties = theme.getSpecialtyIds().stream()
                    .map(adminProxy::getSpecialty)
                    .collect(Collectors.toList());

            StudentDTO student1 = null;
            if (theme.getStudent1Id() != null) {
                student1 = adminProxy.getStudent(theme.getStudent1Id());
            }

            StudentDTO student2 = null;
            if (theme.getStudent2Id() != null) {
                student2 = adminProxy.getStudent(theme.getStudent2Id());
            }

            return new AllThemesDTO(
                    theme.getThemeId(),
                    theme.getTitle(),
                    theme.getDescription(),
                    theme.getFile(),
                    theme.getProgression(),
                    theme.getDate_selection_begin(),
                    theme.getDate_selection_end(),
                    theme.isStatus(),
                    teacher,
                    student1,
                    student2,
                    specialties
            );
        }).collect(Collectors.toList());
    }

    @GetMapping("/assigned-students")
    public ResponseEntity<Set<Long>> getAssignedStudentIds() {
        Set<Long> studentIds = projectThemeService.getAssignedStudentIds();
        return ResponseEntity.ok(studentIds);
    }
}