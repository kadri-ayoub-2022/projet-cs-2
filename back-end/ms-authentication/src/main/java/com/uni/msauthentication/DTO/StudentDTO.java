package com.uni.msauthentication.DTO;

import lombok.Data;

import java.util.Date;

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

}
