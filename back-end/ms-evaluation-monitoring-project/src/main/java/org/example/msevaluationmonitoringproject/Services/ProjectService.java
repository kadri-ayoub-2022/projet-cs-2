package org.example.msevaluationmonitoringproject.Services;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import org.example.msevaluationmonitoringproject.DAO.CommentRepository;
import org.example.msevaluationmonitoringproject.DAO.FileRepository;
import org.example.msevaluationmonitoringproject.DAO.TaskRepository;
import org.example.msevaluationmonitoringproject.DTO.*;
import org.example.msevaluationmonitoringproject.Exception.UnauthorizedException;
import org.example.msevaluationmonitoringproject.Proxy.AuthProxy;
import org.example.msevaluationmonitoringproject.Proxy.TaskClient;
import org.example.msevaluationmonitoringproject.Entities.Task;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
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
            List<Task> tasks = taskRepository.findByProjectId(theme.getThemeId());
            List<TaskDTO> taskDTOs = tasks.stream().map(task -> {
                List<CommentDTO> comments = commentRepository.findByTask_TaskId(task.getTaskId()).stream()
                        .map(c -> new CommentDTO(
                                c.getCommentId(),
                                c.getContent(),
                                c.getCreatedAt(),
                                c.getTask().getTaskId()
                        ))
                        .toList();
                List<FileDTO> files = fileRepository.findByTask_TaskId(task.getTaskId()).stream()
                        .map(f -> new FileDTO(
                                f.getFileId(),
                                f.getCreatedAt(),
                                f.getFileName(),
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


}
