package com.uni.msauthentication.DTO;

import com.fasterxml.jackson.annotation.JsonFilter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;


@Data
@JsonFilter("userFilter")
public class AdminDTO {
    private Long adminId;
    private String fullName;
    private String email;
    private String password;

    private String role = "admin";
}
