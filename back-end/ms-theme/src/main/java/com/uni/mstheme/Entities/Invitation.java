package com.uni.mstheme.Entities;

import com.uni.mstheme.DTO.StudentDTO;
import jakarta.persistence.*;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Invitation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long invitationId;

    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    private int preference_order;

    @ManyToOne
    @JoinColumn(name = "theme_id", nullable = false)
    private ProjectTheme projectTheme;

    private Long student1Id;
    private Long student2Id;

    @Transient
    private StudentDTO student1;
    @Transient
    private StudentDTO student2;



}
