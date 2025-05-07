package com.uni.mstheme;

import com.uni.mstheme.Entities.Invitation;
import com.uni.mstheme.Entities.ProjectTheme;
import com.uni.mstheme.Repository.ProjectThemeRepository;
import com.uni.mstheme.Repository.InvitationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

import java.text.SimpleDateFormat;
import java.util.*;


@SpringBootApplication
@RequiredArgsConstructor
@EnableFeignClients
public class MsThemeApplication implements CommandLineRunner {

    private final ProjectThemeRepository projectThemeRepository;
    private final InvitationRepository invitationRepository;

    public static void main(String[] args) {
        SpringApplication.run(MsThemeApplication.class, args);
    }


    @Override
    public void run(String... args) throws Exception {
        ProjectTheme theme1 = new ProjectTheme(null, "AI in Healthcare", "Using AI to analyze medical data",
                "ai_healthcare.pdf", 20.5, null, null, 1L, null, null, new HashSet<>(Arrays.asList(1L, 3L)), null, null, false, null, null);

        ProjectTheme theme2 = new ProjectTheme(null, "Blockchain Security", "Enhancing security with blockchain",
                "blockchain_security.pdf", 100.0, new SimpleDateFormat("yyyy-MM-dd").parse("2025-02-01"), new SimpleDateFormat("yyyy-MM-dd").parse("2025-05-28"), 2L, null, null, new HashSet<>(Arrays.asList(1L, 3L)), null, null, false, null, null);

        projectThemeRepository.save(theme1);
        projectThemeRepository.save(theme2);

        Invitation invitation1 = new Invitation(null, new Date(), 1, theme1, 1L, null, null, null);
        Invitation invitation2 = new Invitation(null, new Date(), 2, theme2, null, 2L, null, null);
        invitationRepository.save(invitation1);
        invitationRepository.save(invitation2);

    }

}
