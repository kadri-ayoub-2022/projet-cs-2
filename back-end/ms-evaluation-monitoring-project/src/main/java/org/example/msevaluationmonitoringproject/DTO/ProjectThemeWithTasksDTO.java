package org.example.msevaluationmonitoringproject.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectThemeWithTasksDTO {
    private ProjectThemeDTO projectTheme;
    private List<TaskDTO> tasks;
}

