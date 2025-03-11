package com.uni.msadministration.Controllers;

import com.uni.msadministration.Entities.Admin;
import com.uni.msadministration.Entities.Teacher;
import com.uni.msadministration.Entities.Student;
import com.uni.msadministration.Repositories.AdminRepo;
import com.uni.msadministration.Repositories.TeacherRepo;
import com.uni.msadministration.Repositories.StudentRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final AdminRepo adminRepo;
    private final TeacherRepo teacherRepo;
    private final StudentRepo studentRepo;

    @GetMapping("/admin")
    public ResponseEntity<Admin> getAdminByEmail(@RequestParam String email) {
        Optional<Admin> admin = adminRepo.findByEmail(email);
        return admin.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/teacher")
    public ResponseEntity<Teacher> getTeacherByEmail(@RequestParam String email) {
        Optional<Teacher> teacher = teacherRepo.findByEmail(email);
        return teacher.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/student")
    public ResponseEntity<Student> getStudentByEmail(@RequestParam String email) {
        Optional<Student> student = studentRepo.findByEmail(email);
        return student.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/update-password")
    public ResponseEntity<Void> updatePassword(@RequestParam String email, @RequestParam String newPassword) {
        if (adminRepo.existsByEmail(email)) {
            Admin admin = adminRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("Admin not found"));
            admin.setPassword(newPassword);
            adminRepo.save(admin);
        } else if (teacherRepo.existsByEmail(email)) {
            Teacher teacher = teacherRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("Teacher not found"));
            teacher.setPassword(newPassword);
            teacherRepo.save(teacher);
        } else if (studentRepo.existsByEmail(email)) {
            Student student = studentRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("Student not found"));
            student.setPassword(newPassword);
            studentRepo.save(student);
        } else {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().build();
    }

}
