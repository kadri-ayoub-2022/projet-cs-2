package org.example.msevaluationmonitoringproject.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FileUpdateDTO {
    private String fileName;
    private Long taskId; // Optional: only if you want to reassign the file to a different task
}

