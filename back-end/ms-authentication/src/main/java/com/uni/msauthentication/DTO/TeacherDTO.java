package com.uni.msauthentication.DTO;

import lombok.Data;

import java.util.Date;

@Data
public class TeacherDTO {
    private Long teacherId;
    private String fullName;
    private String email;
    private String registrationNumber;
    private Date createdAt;
    private String password;


}
