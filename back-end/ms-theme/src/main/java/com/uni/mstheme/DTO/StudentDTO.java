package com.uni.mstheme.DTO;


import lombok.Data;

import java.util.Date;

@Data
public class StudentDTO {
    private Long studentId;
    private String fullName;
    private String email;
    private String registrationNumber;
    private double average;
}
