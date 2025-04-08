package org.example.msevaluationmonitoringproject.Services;

import feign.FeignException;
import lombok.RequiredArgsConstructor;
import org.example.msevaluationmonitoringproject.DAO.TaskRepository;
import org.example.msevaluationmonitoringproject.DTO.TaskRequestDto;
import org.example.msevaluationmonitoringproject.DTO.TaskUpdateDto;
import org.example.msevaluationmonitoringproject.Entities.Task;
import org.example.msevaluationmonitoringproject.Exception.UnauthorizedException;
import org.example.msevaluationmonitoringproject.Proxy.AuthProxy;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import java.util.Date;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final AuthProxy authProxy;

    public Task createTask(TaskRequestDto dto,String token) {

        ResponseEntity<?> response = null;

        try {
            response = authProxy.getAuthenticatedUser(token);
        } catch (FeignException.Unauthorized e) {
            throw new UnauthorizedException("Invalid or expired token");
        }


        Object userResponse = response.getBody();
        Long teacherId = extractTeacherId(userResponse);

        Task task = new Task();
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setStatus("En attente");
        task.setPriority(dto.getPriority());
        task.setDate_begin(dto.getDate_begin());
        task.setDate_end(dto.getDate_end());
        task.setCreatedAt(new Date());
        task.setProjectId(dto.getProjectId());
        task.setEvaluation("not evaluated");

        return taskRepository.save(task);
    }

    public Task updateTask(Long taskId, TaskUpdateDto dto,String token) {
        ResponseEntity<?> response = null;

        try {
            response = authProxy.getAuthenticatedUser(token);
        } catch (FeignException.Unauthorized e) {
            throw new UnauthorizedException("Invalid or expired token");
        }


        Object userResponse = response.getBody();
        Long teacherId = extractTeacherId(userResponse);

        Task existingTask = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (dto.getTitle() != null) existingTask.setTitle(dto.getTitle());
        if (dto.getDescription() != null) existingTask.setDescription(dto.getDescription());
        if (dto.getStatus() != null) existingTask.setStatus(dto.getStatus());
        if (dto.getPriority() != null) existingTask.setPriority(dto.getPriority());
        if (dto.getDate_begin() != null) existingTask.setDate_begin(dto.getDate_begin());
        if (dto.getDate_end() != null) existingTask.setDate_end(dto.getDate_end());
        if (dto.getEvaluation() != null) existingTask.setEvaluation(dto.getEvaluation());


        return taskRepository.save(existingTask);
    }

    public void deleteTask(Long taskId,String token) {
        ResponseEntity<?> response = null;

        try {
            response = authProxy.getAuthenticatedUser(token);
        } catch (FeignException.Unauthorized e) {
            throw new UnauthorizedException("Invalid or expired token");
        }


        Object userResponse = response.getBody();
        Long teacherId = extractTeacherId(userResponse);


        if (!taskRepository.existsById(taskId)) {
            throw new RuntimeException("Task not found");
        }
        taskRepository.deleteById(taskId);
    }

    public Long extractTeacherId(Object userResponse) {
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
}

