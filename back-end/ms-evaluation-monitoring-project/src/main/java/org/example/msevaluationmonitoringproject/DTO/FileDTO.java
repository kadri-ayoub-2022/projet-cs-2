package org.example.msevaluationmonitoringproject.DTO;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FileDTO {
    private Long fileId;
    private Date createdAt;
    private String fileName;
    private String fileUrl;
    private Long taskId;
}
