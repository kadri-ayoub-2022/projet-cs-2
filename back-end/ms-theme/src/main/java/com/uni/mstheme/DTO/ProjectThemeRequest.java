package com.uni.mstheme.DTO;

import lombok.Data;
import java.util.List;

@Data
public class ProjectThemeRequest {
    private String title;
    private String description;
    private String file;
    private List<String> specialties;
}