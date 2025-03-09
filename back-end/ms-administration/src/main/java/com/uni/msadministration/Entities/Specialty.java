package com.uni.msadministration.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Specialty {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long specialtyId;
    private String name;
    private String acronym;

    @OneToMany(mappedBy = "specialty", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Student> students;
}
