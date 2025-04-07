package org.example.msevaluationmonitoringproject.Controller;

import lombok.RequiredArgsConstructor;
import org.example.msevaluationmonitoringproject.DTO.FileRequestDTO;
import org.example.msevaluationmonitoringproject.DTO.FileUpdateDTO;
import org.example.msevaluationmonitoringproject.Entities.File;
import org.example.msevaluationmonitoringproject.Services.FileService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {

    private final FileService fileService;

    @PostMapping
    public ResponseEntity<?> createFile(@RequestBody FileRequestDTO dto,@RequestHeader("Authorization") String token) {
        try {
            File file = fileService.addFile(dto,token);
            return ResponseEntity.ok(file);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/{fileId}")
    public ResponseEntity<?> updateFile(@PathVariable Long fileId, @RequestBody FileUpdateDTO dto, @RequestHeader("Authorization") String token) {
        try {
            File updatedFile = fileService.updateFile(fileId, dto,token);
            return ResponseEntity.ok(updatedFile);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/{fileId}")
    public ResponseEntity<?> deleteFile(@PathVariable Long fileId,@RequestHeader("Authorization") String token) {
        try {
            fileService.deleteFile(fileId,token);
            return ResponseEntity.ok("File deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }


}
