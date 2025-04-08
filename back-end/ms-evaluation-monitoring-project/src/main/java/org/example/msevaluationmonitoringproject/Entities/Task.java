package org.example.msevaluationmonitoringproject.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.Set;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long taskId;

    private String title;

    private String description;

    private String status;

    private String priority;

    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;


    @Temporal(TemporalType.DATE)
    private Date date_begin;

    @Temporal(TemporalType.DATE)
    private Date date_end;

    private String evaluation;

    @OneToMany( cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<Comment> comments;

    @OneToMany( cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<File> files;

    private Long projectId;

}
