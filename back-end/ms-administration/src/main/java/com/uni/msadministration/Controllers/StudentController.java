package com.uni.msadministration.Controllers;

import com.uni.msadministration.Entities.Specialty;
import com.uni.msadministration.Entities.Student;
import com.uni.msadministration.Repositories.SpecialtyRepo;
import com.uni.msadministration.Repositories.StudentRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.*;

@RestController
@RequestMapping("/api/admin/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentRepo studentRepo;
    private final SpecialtyRepo specialtyRepo;
    private final BCryptPasswordEncoder passwordEncoder;

    // Get all students
    @GetMapping("")
    public List<Student> getAllStudents() {
        return studentRepo.findAll();
    }

    // Get student by ID
    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable Long id) {
        return studentRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // Delete student by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteStudent(@PathVariable Long id) {
        if (!studentRepo.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student not found");
        }
        studentRepo.deleteById(id);
        return ResponseEntity.ok("Student deleted successfully");
    }

    // Add One Student
    @PostMapping("")
    public ResponseEntity<?> addStudent(@RequestBody Student student) {
        List<String> errors = new ArrayList<>();

        if (studentRepo.existsByEmail(student.getEmail())) {
            errors.add("Duplicate email found: " + student.getEmail());
        }

        if (studentRepo.existsByRegistrationNumber(student.getRegistrationNumber())) {
            errors.add("Duplicate registration number found: " + student.getRegistrationNumber());
        }

        Optional<Specialty> optionalSpecialty = specialtyRepo.findById(student.getSpecialty().getSpecialtyId());
        if (optionalSpecialty.isEmpty()) {
            errors.add("Invalid specialty ID: " + student.getSpecialty().getSpecialtyId());
        }

        if (!errors.isEmpty()) {
            return ResponseEntity.badRequest().body(errors);
        }

        student.setPassword(passwordEncoder.encode(student.getPassword()));
        student.setSpecialty(optionalSpecialty.get());
        student.setCreatedAt(new Date());
        student.setStudentId(null);

        studentRepo.save(student);
        return ResponseEntity.status(201).body("Student added successfully.");
    }

    // Update Student By ID
    @PutMapping("/{id}")
    public ResponseEntity<?> updateStudent(@PathVariable Long id, @RequestBody Student updatedStudent) {
        return studentRepo.findById(id)
                .map(student -> {
                    student.setFullName(updatedStudent.getFullName());
                    student.setEmail(updatedStudent.getEmail());
                    student.setPassword(passwordEncoder.encode(updatedStudent.getPassword()));
                    student.setAverage(updatedStudent.getAverage());
                    student.setRegistrationNumber(updatedStudent.getRegistrationNumber());

                    // Fetch the specialty from updatedStudent
                    Optional<Specialty> optionalSpecialty = specialtyRepo.findById(updatedStudent.getSpecialty().getSpecialtyId());
                    if (optionalSpecialty.isEmpty()) {
                        return ResponseEntity.badRequest().body("Invalid specialty ID: " + updatedStudent.getSpecialty().getSpecialtyId());
                    }

                    student.setSpecialty(optionalSpecialty.get());

                    // Save and return updated student
                    Student savedStudent = studentRepo.save(student);
                    return ResponseEntity.ok(savedStudent);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }


    // Add Students by CSV
    @PostMapping("/csv")
    public ResponseEntity<?> uploadStudent(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("CSV file is empty!");
        }

        List<Student> students = new ArrayList<>();
        Set<String> emails = new HashSet<>();
        Set<String> registrationNumbers = new HashSet<>();
        List<String> errors = new ArrayList<>();

        try (BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            String line;
            boolean firstLine = true;
            while ((line = br.readLine()) != null) {
                if (firstLine) {
                    firstLine = false;
                    continue;
                }
                String[] data = line.split(",");

                if (data.length < 6) {
                    errors.add("Invalid file format or missing fields.");
                    continue;
                }

                String fullName = data[0].trim();
                String email = data[1].trim();
                String password = data[2].trim();
                String registrationNumber = data[3].trim();
                double average = Double.parseDouble(data[4].trim());
                String specialtyAcronym = data[5].trim();

                if (studentRepo.existsByEmail(email)) {
                    errors.add("Duplicate email found in database: " + email);
                } else if (!emails.add(email)) {
                    errors.add("Duplicate email found in CSV file: " + email);
                }

                if (studentRepo.existsByRegistrationNumber(registrationNumber)) {
                    errors.add("Duplicate registration number found in database: " + registrationNumber);
                } else if (!registrationNumbers.add(registrationNumber)) {
                    errors.add("Duplicate registration number found in CSV file: " + registrationNumber);
                }


                Optional<Specialty> optionalSpecialty = specialtyRepo.findByAcronym(specialtyAcronym);
                if (optionalSpecialty.isEmpty()) {
                    errors.add("Invalid specialty acronym: " + specialtyAcronym);
                    continue;
                }

                Specialty specialty = optionalSpecialty.get();
                students.add(new Student(null, fullName, email, passwordEncoder.encode(password), average, registrationNumber, specialty, new Date()));
            }

            if (!errors.isEmpty()) {
                return ResponseEntity.badRequest().body(errors);
            }

            studentRepo.saveAll(students);
            return ResponseEntity.status(201).body("Students added successfully.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error processing CSV file.");
        }
    }

}
