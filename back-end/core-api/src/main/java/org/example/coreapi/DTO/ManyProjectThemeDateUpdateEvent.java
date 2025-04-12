package org.example.coreapi.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.awt.*;
import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ManyProjectThemeDateUpdateEvent {
    List<ProjectThemeDateUpdateEvent> events;
}
