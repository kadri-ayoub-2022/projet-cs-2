package org.example.coreapi.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProjectThemeDateUpdateEvent {

    private Long themeId;
    private Date date_selection_begin;
    private Date date_selection_end;


}
