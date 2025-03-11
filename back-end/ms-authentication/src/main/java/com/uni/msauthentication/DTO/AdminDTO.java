package com.uni.msauthentication.DTO;

import lombok.Data;

@Data
public class AdminDTO {
    private Long adminId;
    private String fullName;
    private String email;
    private String password;
}
