package org.example.msevaluationmonitoringproject.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskUpdateDto {
    private String title;
    private String description;
    private String status;
    private String evaluation;
    private String priority;
    private Date date_begin;
    private Date date_end;
    private Long projectId;
}
