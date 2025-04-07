package org.example.msevaluationmonitoringproject.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskDTO {
    private Long taskId;
    private String title;
    private String description;
    private String status;
    private String priority;
    private Date createdAt;
    private Date date_begin;
    private Date date_end;
    private String evaluation;
    private List<FileDTO> files;
    private List<CommentDTO> comments;
}

