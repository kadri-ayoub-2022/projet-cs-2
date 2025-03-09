package com.uni.msadministration.Entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Admin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long adminId;

    private String fullName;
    private String email;
    private String password;
    @Temporal(TemporalType.DATE)
    private Date createdAt = new Date();
}
