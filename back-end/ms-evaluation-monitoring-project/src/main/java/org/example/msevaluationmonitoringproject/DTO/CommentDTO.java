package org.example.msevaluationmonitoringproject.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentDTO {
    private Long commentId;
    private String content;
    private Date createdAt;
    private Long taskId;
    private Long userId;
    private String userRole;
}
