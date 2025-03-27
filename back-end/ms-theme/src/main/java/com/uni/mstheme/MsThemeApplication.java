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
import java.util.Date;
import java.util.List;


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
                "ai_healthcare.pdf", 20.5, new Date(), new Date(), 1L, null, null, null, null, null, null);

        ProjectTheme theme2 = new ProjectTheme(null, "Blockchain Security", "Enhancing security with blockchain",
                "blockchain_security.pdf", 10.0, new Date(), new Date(), 2L, null, null, null, null, null, null);

        projectThemeRepository.save(theme1);
        projectThemeRepository.save(theme2);

        Invitation invitation1 = new Invitation(null, new Date(), 1, theme1, 1L, 2L, null, null);
        Invitation invitation2 = new Invitation(null, new Date(), 1, theme2, 1L, 2L, null, null);
        invitationRepository.save(invitation1);
        invitationRepository.save(invitation2);

    }

}
