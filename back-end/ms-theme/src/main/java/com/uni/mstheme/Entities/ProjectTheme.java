package com.uni.mstheme.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.uni.mstheme.DTO.*;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;
import java.util.Set;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProjectTheme {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long themeId;

    private String title;
    private String description;
    private String file;
    private double progression;
    private Date date_selection_begin;
    private Date date_selection_end;

    private Long teacherId;

    @Transient
    private TeacherDTO teacher;

    @OneToMany(mappedBy = "projectTheme", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<Invitation> invitations;

    @ElementCollection
    @CollectionTable(name = "project_theme_specialty", joinColumns = @JoinColumn(name = "themeId"))
    @Column(name = "specialty_id")
    private Set<Long> specialtyIds;

    private Long student1Id;
    private Long student2Id;

    @Column(columnDefinition = "BOOLEAN DEFAULT false")
    private boolean status;

    @Transient
    private StudentDTO student1;
    @Transient
    private StudentDTO student2;

    @Transient
    private List<JuryMemberDTO> jury;



}
