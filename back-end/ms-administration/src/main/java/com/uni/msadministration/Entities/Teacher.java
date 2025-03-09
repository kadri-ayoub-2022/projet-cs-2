package com.uni.msadministration.Entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Teacher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long teacherId;
    private String fullName;
    private String email;
    private String password;
    private String registrationNumber;
    @Temporal(TemporalType.DATE)
    private Date createdAt = new Date();
}
