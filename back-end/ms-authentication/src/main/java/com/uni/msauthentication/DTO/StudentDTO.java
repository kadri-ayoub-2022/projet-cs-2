package com.uni.msauthentication.DTO;

import com.fasterxml.jackson.annotation.JsonFilter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import java.util.Date;
@JsonFilter("userFilter")
@Data
public class StudentDTO {
    private Long studentId;
    private String fullName;
    private String email;
    private String registrationNumber;
    private double average;
    private SpecialtyDTO specialty;
    private Date createdAt;
    private String password;

    private String role = "student";
}
