package com.uni.mstheme.DTO;


import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class ProjectSelectionDateRequest {
    private List<Long> projectThemeIds;
    private Date date_begin;
    private Date date_end;
}
