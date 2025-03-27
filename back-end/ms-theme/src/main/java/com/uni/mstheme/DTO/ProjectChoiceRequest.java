package com.uni.mstheme.DTO;


import lombok.Data;
import java.util.List;

@Data
public class ProjectChoiceRequest {
    private List<Long> themeIds;
    private Long student1Id;
    private Long student2Id;
    private List<Integer> preferencesNumber;
}
