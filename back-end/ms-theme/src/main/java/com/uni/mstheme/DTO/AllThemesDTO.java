package com.uni.mstheme.DTO;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.uni.mstheme.Entities.Invitation;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.Set;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class AllThemesDTO {
    private Long themeId;

    private String title;
    private String description;
    private String file;
    private double progression;
    private Date date_selection_begin;
    private Date date_selection_end;
    private boolean status;
    private TeacherDTO teacher;
    private List<SpecialtyDTO> specialties;
}
