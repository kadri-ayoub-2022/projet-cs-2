package org.example.msevaluationmonitoringproject.Services;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import org.example.coreapi.DTO.StudentDTO;
import org.example.coreapi.DTO.TeacherDTO;
import org.example.msevaluationmonitoringproject.DAO.CommentRepository;
import org.example.msevaluationmonitoringproject.DAO.FileRepository;
import org.example.msevaluationmonitoringproject.DAO.TaskRepository;
import org.example.msevaluationmonitoringproject.DTO.*;
import org.example.msevaluationmonitoringproject.Exception.UnauthorizedException;
import org.example.msevaluationmonitoringproject.Proxy.AdminProxy;
import org.example.msevaluationmonitoringproject.Proxy.AuthProxy;
import org.example.msevaluationmonitoringproject.Proxy.TaskClient;
import org.example.msevaluationmonitoringproject.Entities.Task;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final TaskClient themeClient;
    private final TaskRepository taskRepository;
    private final CommentRepository commentRepository;
    private final FileRepository fileRepository;
    private final AuthProxy authProxy;
    private final TaskService taskService;
    private final AdminProxy adminProxy;

    public List<ProjectThemeWithTasksDTO> getThemesWithTasksByTeacher(String token) {
        ResponseEntity<?> response = null;

        try {
            response = authProxy.getAuthenticatedUser(token);
        } catch (FeignException.Unauthorized e) {
            throw new UnauthorizedException("Invalid or expired token");
        }


        Object userResponse = response.getBody();
        Long teacherId = taskService.extractTeacherId(userResponse);
        List<ProjectThemeDTO> themes = null;
        try {
            ResponseEntity<?>  themess = themeClient.getProjectThemesByTeacherId(token);
            Object body = themess.getBody();
            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            List<?> rawList = (List<?>) body;
            themes = rawList.stream()
                    .map(item -> mapper.convertValue(item, ProjectThemeDTO.class))
                    .collect(Collectors.toList());

            if (themes == null || themes.isEmpty()) {
                throw new RuntimeException("No project themes found for teacher ID: " + teacherId);
            }
        } catch (FeignException e) {
            throw new RuntimeException("Failed to retrieve themes: " + e.getMessage());
        }

        return themes.stream().map(theme -> {
            if(theme.getStudent1Id() != null){
                StudentDTO std1 = adminProxy.getStudent(theme.getStudent1Id());
                if(std1 != null){
                    theme.setStudent1(std1);
                }
            }
            if(theme.getStudent2Id() != null){
                StudentDTO std2 = adminProxy.getStudent(theme.getStudent2Id());
                if(std2 != null){
                    theme.setStudent2(std2);
                }
            }
            if(theme.getTeacherId() != null){
                TeacherDTO teach = adminProxy.getTeacher(theme.getTeacherId());
                if(teach != null){
                    theme.setTeacher(teach);
                }
            }
            List<Task> tasks = taskRepository.findByProjectId(theme.getThemeId());
            List<TaskDTO> taskDTOs = tasks.stream().map(task -> {
                List<CommentDTO> comments = commentRepository.findByTask_TaskId(task.getTaskId()).stream()
                        .map(c -> new CommentDTO(
                                c.getCommentId(),
                                c.getContent(),
                                c.getCreatedAt(),
                                c.getTask().getTaskId(),
                                c.getUserId(),
                                c.getUserRole()
                        ))
                        .toList();
                List<FileDTO> files = fileRepository.findByTask_TaskId(task.getTaskId()).stream()
                        .map(f -> new FileDTO(
                                f.getFileId(),
                                f.getCreatedAt(),
                                f.getFileName(),
                                f.getFileUrl(),
                                f.getTask().getTaskId()
                        ))
                        .toList();
                return new TaskDTO(
                        task.getTaskId(),
                        task.getTitle(),
                        task.getDescription(),
                        task.getStatus(),
                        task.getPriority(),
                        task.getCreatedAt(),
                        task.getDate_begin(),
                        task.getDate_end(),
                        task.getEvaluation(),
                        files,
                        comments
                );
            }).toList();
            return new ProjectThemeWithTasksDTO(theme,taskDTOs);
        }).toList();
    }

    public ProjectThemeWithTasksDTO getThemesWithTasksByStudent(String token) {
        ResponseEntity<?> response = null;

        try {
            response = authProxy.getAuthenticatedUser(token);
        } catch (FeignException.Unauthorized e) {
            throw new UnauthorizedException("Invalid or expired token");
        }


        Object userResponse = response.getBody();
        Long studentId = extractStudentId(userResponse);
        try {
            ResponseEntity<?>  themess = themeClient.getProjectThemesByStudentId(studentId);
            if (themess == null || themess.getBody() == null) {
                throw new RuntimeException("No response received for student ID: " + studentId);
            }
            Object body = themess.getBody();
            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

            Object body1 = themess.getBody();
            ObjectMapper mapper1 = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            ProjectThemeDTO theme = mapper1.convertValue(body1, ProjectThemeDTO.class);

            if (theme == null) {
                throw new RuntimeException("No project theme found for student ID: " + studentId);
            }
            if(theme.getStudent1Id() != null){
                StudentDTO std1 = adminProxy.getStudent(theme.getStudent1Id());
                if(std1 != null){
                    theme.setStudent1(std1);
                }
            }
            if(theme.getStudent2Id() != null){
                StudentDTO std2 = adminProxy.getStudent(theme.getStudent2Id());
                if(std2 != null){
                    theme.setStudent2(std2);
                }
            }
            if(theme.getTeacherId() != null){
                TeacherDTO teach = adminProxy.getTeacher(theme.getTeacherId());
                if(teach != null){
                    theme.setTeacher(teach);
                }
            }
            List<Task> tasks = taskRepository.findByProjectId(theme.getThemeId());
            List<TaskDTO> taskDTOs = tasks.stream().map(task -> {
                List<CommentDTO> comments = commentRepository.findByTask_TaskId(task.getTaskId()).stream()
                        .map(c -> new CommentDTO(
                                c.getCommentId(),
                                c.getContent(),
                                c.getCreatedAt(),
                                c.getTask().getTaskId(),
                                c.getUserId(),
                                c.getUserRole()
                        ))
                        .toList();
                List<FileDTO> files = fileRepository.findByTask_TaskId(task.getTaskId()).stream()
                        .map(f -> new FileDTO(
                                f.getFileId(),
                                f.getCreatedAt(),
                                f.getFileName(),
                                f.getFileUrl(),
                                f.getTask().getTaskId()
                        ))
                        .toList();
                return new TaskDTO(
                        task.getTaskId(),
                        task.getTitle(),
                        task.getDescription(),
                        task.getStatus(),
                        task.getPriority(),
                        task.getCreatedAt(),
                        task.getDate_begin(),
                        task.getDate_end(),
                        task.getEvaluation(),
                        files,
                        comments
                );
            }).toList();
            return new ProjectThemeWithTasksDTO(theme,taskDTOs);

        } catch (FeignException e) {
            throw new RuntimeException("Failed to retrieve themes: " + e.getMessage());
        }
    }



    public Long extractStudentId(Object userResponse) {
        if (userResponse instanceof Map) {
            Map<String, Object> userMap = (Map<String, Object>) userResponse;
            Object role = userMap.get("role");

            if (!"student".equals(role)) {
                throw new UnauthorizedException("Only students can access this");
            } else {
                return ((Number) userMap.get("studentId")).longValue();
            }

        }
        throw new RuntimeException("Unexpected response format from authentication service");
    }


}
