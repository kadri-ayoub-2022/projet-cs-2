package com.uni.mstheme.Service;


import com.uni.mstheme.DTO.ProjectChoiceRequest;
import com.uni.mstheme.DTO.StudentDTO;
import com.uni.mstheme.Entities.Invitation;
import com.uni.mstheme.Entities.ProjectTheme;
import com.uni.mstheme.Exception.InvalidRequestException;
import com.uni.mstheme.Proxy.AdminProxy;
import com.uni.mstheme.Repository.InvitationRepository;
import com.uni.mstheme.Repository.ProjectThemeRepository;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.IntStream;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class InvitationService {

    private final InvitationRepository invitationRepository;
    private final ProjectThemeRepository  projectThemeRepository;
    private final AdminProxy adminProxy;

    public void saveProjectChoice(ProjectChoiceRequest request) {
        if (request.getThemeIds() == null || request.getStudent1Id() == null || request.getStudent2Id() == null || request.getPreferencesNumber() == null) {
            throw new IllegalArgumentException("Missing required fields.");
        }

        if (request.getThemeIds().size() != request.getPreferencesNumber().size()) {
            throw new IllegalArgumentException("Each theme must have a corresponding preference number.");
        }


        try {
            StudentDTO student1 = adminProxy.getStudent(request.getStudent1Id());
            StudentDTO student2 = adminProxy.getStudent(request.getStudent2Id());
        } catch (FeignException.NotFound e) {
            throw new IllegalArgumentException("One or both students not found.");
        }




        IntStream.range(0, request.getThemeIds().size()).forEach(i -> {
            Long themeId = request.getThemeIds().get(i);
            int preference = request.getPreferencesNumber().get(i);

            ProjectTheme projectTheme = projectThemeRepository.findById(themeId)
                    .orElseThrow(() -> new IllegalArgumentException("theme not found"));

            Invitation invitation = new Invitation(
                    null,
                    new Date(),
                    preference,
                    projectTheme,
                    request.getStudent1Id(),
                    request.getStudent2Id(),
                    null,
                    null
            );

            invitationRepository.save(invitation);

        });
    }

    public List<Invitation> getInvitationsByThemeId(Long themeId) {
        List<Invitation> invitations = invitationRepository.findByProjectTheme_ThemeId(themeId);

        for (Invitation invitation : invitations) {
            StudentDTO student1 = adminProxy.getStudent(invitation.getStudent1Id());
            StudentDTO student2 = adminProxy.getStudent(invitation.getStudent2Id());

            invitation.setStudent1(student1);
            invitation.setStudent2(student2);
        }

        return invitations;
    }


    public long countByThemeId(Long themeId) {
        return invitationRepository.countByProjectTheme_ThemeId(themeId);
    }

}
