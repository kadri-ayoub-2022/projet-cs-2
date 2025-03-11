package com.uni.msadministration;

import com.uni.msadministration.Entities.Admin;
import com.uni.msadministration.Entities.Specialty;
import com.uni.msadministration.Entities.Student;
import com.uni.msadministration.Entities.Teacher;
import com.uni.msadministration.Repositories.AdminRepo;
import com.uni.msadministration.Repositories.SpecialtyRepo;
import com.uni.msadministration.Repositories.StudentRepo;
import com.uni.msadministration.Repositories.TeacherRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Date;
import java.util.List;

@SpringBootApplication
@RequiredArgsConstructor
@EnableFeignClients
public class MsAdministrationApplication implements CommandLineRunner {

    private final AdminRepo adminRepo;
    private final StudentRepo studentRepo;
    private final TeacherRepo teacherRepo;
    private final SpecialtyRepo specialtyRepo;
    private final BCryptPasswordEncoder passwordEncoder;

    public static void main(String[] args) {
        SpringApplication.run(MsAdministrationApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        adminRepo.save(new Admin(null, "Admin User", "admin@example.com", passwordEncoder.encode("admin123"), new Date()));

        Specialty sp1 = specialtyRepo.save(new Specialty(null, "Information Systems and Web", "SIW", null));
        Specialty sp2 = specialtyRepo.save(new Specialty(null, "Computer Systems Engineering","ISI", null));
        Specialty sp3 = specialtyRepo.save(new Specialty(null, "Artificial Intelligence and Data Sciences","IASD", null));


        teacherRepo.saveAll(List.of(
                new Teacher(null, "Dr. John Doe", "johndoe@example.com", passwordEncoder.encode("password1"), "TCH123", new Date()),
                new Teacher(null, "Dr. Jane Smith", "janesmith@example.com", passwordEncoder.encode("password2"), "TCH124", new Date())
        ));

        // here you can enter your email to test the forget password functionality
        studentRepo.saveAll(List.of(
                new Student(null, "Alice Johnson", "alice@example.com", passwordEncoder.encode("student1"), 15.5, "STU001", sp1, new Date()),
                new Student(null, "Bob Williams", "prince.abdellah55@gmail.com", passwordEncoder.encode("student2"), 13.8, "STU002", sp2, new Date())
        ));
    }
}
