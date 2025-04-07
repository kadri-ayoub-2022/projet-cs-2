package org.example.msevaluationmonitoringproject.Services;

import feign.FeignException;
import lombok.RequiredArgsConstructor;
import org.example.msevaluationmonitoringproject.DAO.FileRepository;
import org.example.msevaluationmonitoringproject.DAO.TaskRepository;
import org.example.msevaluationmonitoringproject.DTO.FileRequestDTO;
import org.example.msevaluationmonitoringproject.DTO.FileUpdateDTO;
import org.example.msevaluationmonitoringproject.Entities.File;
import org.example.msevaluationmonitoringproject.Entities.Task;
import org.example.msevaluationmonitoringproject.Exception.UnauthorizedException;
import org.example.msevaluationmonitoringproject.Proxy.AuthProxy;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
@RequiredArgsConstructor
public class FileService {

    private final FileRepository fileRepository;
    private final TaskRepository taskRepository;
    private final AuthProxy authProxy;

    public File addFile(FileRequestDTO dto, String token) {
        ResponseEntity<?> response = null;

        try {
            response = authProxy.getAuthenticatedUser(token);
        } catch (FeignException.Unauthorized e) {
            throw new UnauthorizedException("Invalid or expired token");
        }

        Task task = taskRepository.findById(dto.getTaskId())
                .orElseThrow(() -> new RuntimeException("Task not found"));

        File file = new File();
        file.setCreatedAt(new Date());
        file.setFileName(dto.getFileName());
        file.setTask(task);

        return fileRepository.save(file);
    }

    public File updateFile(Long fileId, FileUpdateDTO dto, String token) {
        ResponseEntity<?> response = null;

        try {
            response = authProxy.getAuthenticatedUser(token);
        } catch (FeignException.Unauthorized e) {
            throw new UnauthorizedException("Invalid or expired token");
        }

        File file = fileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found"));

        if (dto.getFileName() != null) {
            file.setFileName(dto.getFileName());
        }

        if (dto.getTaskId() != null) {
            Task task = taskRepository.findById(dto.getTaskId())
                    .orElseThrow(() -> new RuntimeException("Task not found"));
            file.setTask(task);
        }

        return fileRepository.save(file);
    }

    public void deleteFile(Long fileId, String token) {
        ResponseEntity<?> response = null;

        try {
            response = authProxy.getAuthenticatedUser(token);
        } catch (FeignException.Unauthorized e) {
            throw new UnauthorizedException("Invalid or expired token");
        }

        if (!fileRepository.existsById(fileId)) {
            throw new RuntimeException("File not found");
        }
        fileRepository.deleteById(fileId);
    }



}

