package com.uni.mstheme.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JuryMemberDTO {
    private Long id;
    private String name;
    private String email;
    private Double note;

}
