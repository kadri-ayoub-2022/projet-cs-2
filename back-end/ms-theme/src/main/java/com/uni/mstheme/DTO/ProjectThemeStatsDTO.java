package com.uni.mstheme.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProjectThemeStatsDTO {
    private long total;
    private long completed;
    private long notCompleted;
    private long fullProgress;
    private long partialProgress;
    private Long studentCount;
    private Long teacherCount;
    private long undeliveredProjects;
    private long deliveredProjects;

}

