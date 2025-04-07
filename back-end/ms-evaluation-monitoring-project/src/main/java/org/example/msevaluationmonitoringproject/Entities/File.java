package org.example.msevaluationmonitoringproject.Entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;


@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class File {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long fileId;

    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    private String fileName;

    @ManyToOne
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;

}
