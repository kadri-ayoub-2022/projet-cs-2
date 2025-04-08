package org.example.msevaluationmonitoringproject.Controller;

import lombok.RequiredArgsConstructor;
import org.example.msevaluationmonitoringproject.DTO.TaskRequestDto;
import org.example.msevaluationmonitoringproject.DTO.TaskUpdateDto;
import org.example.msevaluationmonitoringproject.Entities.Task;
import org.example.msevaluationmonitoringproject.Services.TaskService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {
// abdellah kharay
    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<?> createTask(
            @RequestBody TaskRequestDto dto,
            @RequestHeader("Authorization") String token
    ) {
        try {
            Task createdTask = taskService.createTask(dto, token);
            return new ResponseEntity<>(createdTask, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<?> updateTask(
            @PathVariable Long taskId,
            @RequestBody TaskUpdateDto dto,
            @RequestHeader("Authorization") String token
    ) {
        try {
            Task updatedTask = taskService.updateTask(taskId, dto,token);
            return ResponseEntity.ok(updatedTask);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<?> deleteTask(@PathVariable Long taskId, @RequestHeader("Authorization") String token) {
        try {
            taskService.deleteTask(taskId, token);
            return ResponseEntity.ok("Task deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

}
