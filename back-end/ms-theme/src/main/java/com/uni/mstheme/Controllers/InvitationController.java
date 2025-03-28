package com.uni.mstheme.Controllers;


import com.uni.mstheme.DTO.ProjectChoiceRequest;
import com.uni.mstheme.Entities.Invitation;
import com.uni.mstheme.Service.InvitationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/project-themes")
@RequiredArgsConstructor
public class InvitationController {

    private final InvitationService invitationService;


    @PostMapping("/project-choices")
    public ResponseEntity<String> chooseProjectTheme(@RequestBody ProjectChoiceRequest request){
        try {
            invitationService.saveProjectChoice(request);
            return ResponseEntity.status(201).body("Preferences saved successfully.");
        } catch( IllegalArgumentException e ) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{themeId}/invitations")
    public ResponseEntity<List<Invitation>> getInvitationsByThemeId(@PathVariable Long themeId) {
        List<Invitation> invitations = invitationService.getInvitationsByThemeId(themeId);
        return ResponseEntity.ok(invitations);
    }

    @GetMapping("/{themeId}/invitations/count")
    public ResponseEntity<Long> getInvitationCount(@PathVariable Long themeId) {
        long count = invitationService.countByThemeId(themeId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/students/{studentId}/invitations")
    public ResponseEntity<List<Invitation>> getInvitationsByStudentId(@PathVariable Long studentId) {
        List<Invitation> invitations = invitationService.getInvitationsByStudentId(studentId);
        return ResponseEntity.ok(invitations);
    }
}
