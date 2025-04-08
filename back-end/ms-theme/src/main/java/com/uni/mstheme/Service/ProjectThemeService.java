package com.uni.mstheme.Service;

import com.uni.mstheme.DTO.*;
import com.uni.mstheme.Entities.Invitation;
import com.uni.mstheme.Entities.ProjectTheme;
import com.uni.mstheme.Exception.NotFoundException;
import com.uni.mstheme.Exception.UnauthorizedException;
import com.uni.mstheme.Proxy.AdminProxy;
import com.uni.mstheme.Proxy.AuthProxy;
import com.uni.mstheme.Repository.InvitationRepository;
import com.uni.mstheme.Repository.ProjectThemeRepository;
import feign.FeignException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import com.uni.mstheme.Exception.InvalidRequestException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectThemeService {

    private final ProjectThemeRepository projectThemeRepository;
    private final InvitationRepository  invitationRepository;
    private final AuthProxy authProxy;
    private final AdminProxy adminProxy;

    public ProjectTheme createProjectTheme(ProjectThemeRequest request, String token) {
        if (request.getTitle() == null || request.getDescription() == null || request.getFile() == null || request.getSpecialties() == null) {
            throw new InvalidRequestException("Missing required fields.");
        }

        ResponseEntity<?> response = null;

        try {
           response = authProxy.getAuthenticatedUser(token);
        } catch (FeignException.Unauthorized e) {
           throw new UnauthorizedException("Invalid or expired token");
        }


        Object userResponse = response.getBody();
        Long teacherId = extractTeacherId(userResponse);



        Set<Long> specialtyIds = request.getSpecialties()
                .stream()
                .map(Long::valueOf)
                .collect(Collectors.toSet());

        ProjectTheme projectTheme = new ProjectTheme(
                null,
                request.getTitle(),
                request.getDescription(),
                request.getFile(),
                0.0,
                null,
                null,
                teacherId,
                null,
                null,
                specialtyIds,
                null,
                null,
                false,
                null,
                null
        );

        return projectThemeRepository.save(projectTheme);

    }

    public List<ProjectTheme> getProjectThemesByToken(String token) {

        ResponseEntity<?> response = null;
        try {
            response = authProxy.getAuthenticatedUser(token);
        } catch (FeignException.Unauthorized e) {
            throw new UnauthorizedException("Invalid or expired token");
        }

        Object userResponse = response.getBody();
        Long teacherId = extractTeacherId(userResponse);

        List<ProjectTheme> projectThemes = projectThemeRepository.findByTeacherId(teacherId);



        if (projectThemes.isEmpty()) {
            throw new NotFoundException("No project themes found for teacher ID: " + teacherId);
        }

        projectThemes.forEach(projectTheme -> {
            if(projectTheme.getStudent1Id() != null && projectTheme.getStudent2Id() != null) {
                StudentDTO student1 = adminProxy.getStudent(projectTheme.getStudent1Id());
                StudentDTO student2 = adminProxy.getStudent(projectTheme.getStudent2Id());
                projectTheme.setStudent1(student1);
                projectTheme.setStudent2(student2);
            }
        });

        return new ArrayList<>(projectThemes);

    }

    public void defineProjectSelectionDate(ProjectSelectionDateRequest request, String token) {
       if (request.getProjectThemeIds() == null || request.getDate_begin() == null || request.getDate_end() == null) {
            throw new InvalidRequestException("Missing required fields.");
       }

        ResponseEntity<?> response = null;

        try {
            response = authProxy.getAuthenticatedUser(token);
        } catch (FeignException.Unauthorized e) {
            throw new UnauthorizedException("Invalid or expired token");
        }

        Object userResponse = response.getBody();


        if (userResponse instanceof Map) {
            Map<String, Object> userMap = (Map<String, Object>) userResponse;
            Object role = userMap.get("role");
            if (!"admin".equals(role)) {
                throw new UnauthorizedException("Only admins can modify project dates");
            }
        } else {
            throw new RuntimeException("Unexpected response format from authentication service");
        }

        List<ProjectTheme> projectThemes = projectThemeRepository.findAllById(request.getProjectThemeIds());

        if (projectThemes.isEmpty()) {
            throw new NotFoundException("No valid project themes found.");
        }

        for (ProjectTheme projectTheme : projectThemes) {
            projectTheme.setDate_selection_begin(request.getDate_begin());
            projectTheme.setDate_selection_end(request.getDate_end());
        }

        projectThemeRepository.saveAll(projectThemes);
    }

    public void validateProjectAssignment(Long themeId, ProjectThemeValidationRequest request, String token) {
        if (request.getInvitationId() == null || request.getStatus() == null) {
            throw new InvalidRequestException("Missing required fields.");
        }

        ResponseEntity<?> response = null;

        try {
            response = authProxy.getAuthenticatedUser(token);
        } catch (FeignException.Unauthorized e) {
            throw new UnauthorizedException("Invalid or expired token");
        }

        Object userResponse = response.getBody();
        Long teacherId = extractTeacherId(userResponse);

        ProjectTheme projectTheme = projectThemeRepository.findById(themeId)
                .orElseThrow(() -> new NotFoundException("Project theme not found"));

        if (!projectTheme.getTeacherId().equals(teacherId)) {
            throw new UnauthorizedException("You can only validate themes assigned to you");
        }

        Invitation invitation = invitationRepository.findById(request.getInvitationId())
                .orElseThrow(() -> new NotFoundException("Invitation not found"));

        if ("validated".equals(request.getStatus())) {
            projectTheme.setStudent1Id(invitation.getStudent1Id());
            projectTheme.setStudent2Id(invitation.getStudent2Id());
            projectThemeRepository.save(projectTheme);
            invitationRepository.deleteByProjectTheme_ThemeId(themeId);
        }
    }

    public void deleteProjectTheme(Long themeId, String token) {

        ResponseEntity<?> response = null;

        try {
            response = authProxy.getAuthenticatedUser(token);
        } catch (FeignException.Unauthorized e) {
            throw new UnauthorizedException("Invalid or expired token");
        }

        Object userResponse = response.getBody();
        Long teacherId = extractTeacherId(userResponse);

        ProjectTheme projectTheme = projectThemeRepository.findById(themeId)
                .orElseThrow(() -> new EntityNotFoundException("Project theme not found."));

        if (!projectTheme.getTeacherId().equals(teacherId)) {
            throw new UnauthorizedException("You are not authorized to delete this theme.");
        }

        projectThemeRepository.deleteById(themeId);
    }

    public ProjectTheme updateProjectTheme(Long themeId, ProjectThemeRequest request, String token) {
        if (request.getTitle() == null || request.getDescription() == null || request.getFile() == null || request.getSpecialties() == null) {
            throw new InvalidRequestException("Missing required fields.");
        }

        ResponseEntity<?> response = null;
        try {
            response = authProxy.getAuthenticatedUser(token);
        } catch (FeignException.Unauthorized e) {
            throw new UnauthorizedException("Invalid or expired token");
        }

        Object userResponse = response.getBody();
        Long teacherId = extractTeacherId(userResponse);

        ProjectTheme projectTheme = projectThemeRepository.findById(themeId)
                .orElseThrow(() -> new EntityNotFoundException("Project theme not found"));

        if (!projectTheme.getTeacherId().equals(teacherId)) {
            throw new UnauthorizedException("You are not authorized to edit this theme.");
        }

        Set<Long> specialtyIds = request.getSpecialties()
                .stream()
                .map(Long::valueOf)
                .collect(Collectors.toSet());

        projectTheme.setTitle(request.getTitle());
        projectTheme.setDescription(request.getDescription());
        projectTheme.setSpecialtyIds(specialtyIds);

        return projectThemeRepository.save(projectTheme);
    }

    public List<ProjectTheme> getUnassignedProjectThemes() {
        List<ProjectTheme> themes = projectThemeRepository.findByStudent1IdIsNullAndStudent2IdIsNull();
        Date now = new Date();

        List<ProjectTheme> filteredThemes = themes.stream()
                .filter(theme -> {
                    Date beginDate = theme.getDate_selection_begin();
                    Date endDate = theme.getDate_selection_end();


                    return (beginDate == null || endDate == null) || (now.after(beginDate) && now.before(endDate));
                })
                .collect(Collectors.toList());

        filteredThemes.forEach(theme -> {
            TeacherDTO teacher = adminProxy.getTeacher(theme.getTeacherId());
            theme.setTeacher(teacher);
        });

        return filteredThemes;

    }



    private Long extractTeacherId(Object userResponse) {
        if (userResponse instanceof Map) {
            Map<String, Object> userMap = (Map<String, Object>) userResponse;
            Object role = userMap.get("role");

            if (!"teacher".equals(role)) {
                throw new UnauthorizedException("Only teachers can access this");
            } else {
                return ((Number) userMap.get("teacherId")).longValue();
            }

        }
        throw new RuntimeException("Unexpected response format from authentication service");
    }

    public Optional<ProjectTheme> getThemeByStudentId(Long studentId) {
        return projectThemeRepository.findByStudent1IdOrStudent2Id(studentId, studentId);
    }

}
