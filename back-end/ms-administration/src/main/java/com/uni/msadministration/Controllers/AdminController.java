package com.uni.msadministration.Controllers;

import com.uni.msadministration.Services.ProjectThemeDateProducer;
import com.uni.msadministration.Services.ProjectThemeStatusProducer;
import lombok.RequiredArgsConstructor;
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

    @PutMapping("/update-theme-date/{themeId}")
    public ResponseEntity<String> updateDateStatus(@PathVariable Long themeId, @RequestParam String dateb,@RequestParam String datee,@RequestHeader("Authorization") String token) throws ParseException {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        Date startDate = dateFormat.parse(dateb);
        Date endDate = dateFormat.parse(datee);
        dateProducer.sendStatusUpdate(themeId, startDate, endDate, token);
        return ResponseEntity.ok("Date update sent for ProjectTheme ID: " + themeId);
    }

}
