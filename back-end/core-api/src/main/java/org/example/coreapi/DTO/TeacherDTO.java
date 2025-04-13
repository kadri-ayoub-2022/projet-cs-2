package org.example.coreapi.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TeacherDTO {
    private Long teacherId;
    private String fullName;
    private String email;
    private String password;
    private String registrationNumber;
}
