package org.example.msevaluationmonitoringproject.DTO;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.coreapi.DTO.StudentDTO;
import org.example.coreapi.DTO.TeacherDTO;

import java.util.Date;


@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProjectThemeDTO {
    private Long themeId;
    private String title;
    private String description;
    private double progression;
    private Date date_selection_begin;
    private Date date_selection_end;
    private Long student1Id;
    private Long student2Id;
    private Long teacherId;
    private boolean status;
    private TeacherDTO teacher;
    private StudentDTO student1;
    private StudentDTO student2;
}
