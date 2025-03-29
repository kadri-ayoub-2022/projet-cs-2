package com.uni.mstheme.DTO;


import lombok.Data;

@Data
public class TeacherDTO {
    private Long teacherId;
    private String fullName;
    private String email;
    private String password;
    private String registrationNumber;

}
