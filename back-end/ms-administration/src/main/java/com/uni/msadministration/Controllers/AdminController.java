package com.uni.msadministration.Controllers;

import com.uni.msadministration.Services.ProjectThemeDateProducer;
import com.uni.msadministration.Services.ProjectThemeStatusProducer;
import lombok.RequiredArgsConstructor;
import org.example.coreapi.DTO.ManyProjectThemeDateUpdateEvent;
import org.example.coreapi.DTO.ManyProjectThemeStatusUpdateEvent;
import org.example.coreapi.DTO.ProjectThemeDateUpdateEvent;
import org.example.coreapi.DTO.ProjectThemeStatusUpdateEvent;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    private final ProjectThemeStatusProducer producer;
    private final ProjectThemeDateProducer dateProducer;

    @PutMapping("/update-theme-status/{themeId}")
    public ResponseEntity<String> updateThemeStatus(@PathVariable Long themeId, @RequestParam boolean status, @RequestHeader("Authorization") String token) {
        producer.sendStatusUpdate(themeId, status, token);
        return ResponseEntity.ok("Status update sent for ProjectTheme ID: " + themeId);
    }
    @PutMapping("/update-many-theme-status")
    public ResponseEntity<String> updateManyThemeStatus(@RequestBody ManyProjectThemeStatusUpdateEvent request, @RequestHeader("Authorization") String token){
        for (ProjectThemeStatusUpdateEvent theme : request.getEvents()) {
            producer.sendStatusUpdate(theme.getThemeId(), theme.isStatus(), token);
        }
        return ResponseEntity.ok("Status updates sent for ProjectTheme ");
    }


    @PutMapping("/update-theme-date/{themeId}")
    public ResponseEntity<String> updateDateStatus(@PathVariable Long themeId, @RequestParam String dateb,@RequestParam String datee,@RequestHeader("Authorization") String token) throws ParseException {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        Date startDate = dateFormat.parse(dateb);
        Date endDate = dateFormat.parse(datee);
        dateProducer.sendStatusUpdate(themeId, startDate, endDate, token);
        return ResponseEntity.ok("Date update sent for ProjectTheme ID: " + themeId);
    }

    @PutMapping("/update-many-theme-date")
    public ResponseEntity<String> updateManyDateStatus(
            @RequestBody ManyProjectThemeDateUpdateEvent request,
            @RequestHeader("Authorization") String token) {

        for (ProjectThemeDateUpdateEvent theme : request.getEvents()) {
            dateProducer.sendStatusUpdate(
                    theme.getThemeId(),
                    theme.getDate_selection_begin(),
                    theme.getDate_selection_end(),
                    token);
        }

        return ResponseEntity.ok("Date update sent for ProjectTheme ID");
    }


}
