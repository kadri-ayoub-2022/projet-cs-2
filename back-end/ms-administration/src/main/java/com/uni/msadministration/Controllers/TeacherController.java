package com.uni.msadministration.Controllers;

import com.uni.msadministration.Entities.Teacher;
import com.uni.msadministration.Repositories.TeacherRepo;
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
@RequestMapping("/api/admin/teachers")
@RequiredArgsConstructor
public class TeacherController {

    private final TeacherRepo teacherRepo;
    private final BCryptPasswordEncoder passwordEncoder;

    @GetMapping("/count")
    public Long getTeacherCount() {
        return teacherRepo.count();
    }
    // Get All Teachers
    @GetMapping("")
    public List<Teacher> getAllTeachers() {
        return teacherRepo.findAll();
    }

    // Get teacher by ID
    @GetMapping("/{id}")
    public ResponseEntity<Teacher> getTeacherById(@PathVariable Long id) {
        return teacherRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // Delete teacher by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTeacher(@PathVariable Long id) {
        if (!teacherRepo.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Teacher not found");
        }
        teacherRepo.deleteById(id);
        return ResponseEntity.ok("Teacher deleted successfully");
    }

    // Delete multiple teachers by IDs
    @DeleteMapping("/many")
    public ResponseEntity<?> deleteMultipleTeachers(@RequestBody List<Long> ids) {
        if (ids.isEmpty()) {
            return ResponseEntity.badRequest().body("No teacher IDs provided for deletion.");
        }

        List<Long> existingIds = teacherRepo.findAllById(ids).stream()
                .map(Teacher::getTeacherId)
                .toList();

        if (existingIds.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No valid teacher IDs found.");
        }

        teacherRepo.deleteAllById(existingIds);

        Map<String, Object> response = new HashMap<>();
        response.put("deletedCount", existingIds.size());
        response.put("deletedIds", existingIds);

        return ResponseEntity.ok(response);
    }


    // Add One Teacher
    @PostMapping("")
    public ResponseEntity<?> addTeacher(@RequestBody Teacher teacher) {
        List<String> errors = new ArrayList<>();

        if (teacherRepo.existsByEmail(teacher.getEmail())) {
            errors.add("Duplicate email found: " + teacher.getEmail());
        }

        if (teacherRepo.existsByRegistrationNumber(teacher.getRegistrationNumber())) {
            errors.add("Duplicate registration number found: " + teacher.getRegistrationNumber());
        }

        if (!errors.isEmpty()) {
            return ResponseEntity.badRequest().body(errors);
        }

        teacher.setPassword(passwordEncoder.encode(teacher.getPassword()));
        teacher.setCreatedAt(new Date());

        teacherRepo.save(teacher);
        return ResponseEntity.status(201).body("Teacher added successfully.");
    }

    // Update Teacher By ID
    @PutMapping("/{id}")
    public ResponseEntity<Teacher> updateTeacher(@PathVariable Long id, @RequestBody Teacher updatedTeacher) {
        return teacherRepo.findById(id)
                .map(teacher -> {
                    teacher.setFullName(updatedTeacher.getFullName());
                    teacher.setEmail(updatedTeacher.getEmail());
                    teacher.setPassword(passwordEncoder.encode(updatedTeacher.getPassword()));
                    teacher.setCreatedAt(updatedTeacher.getCreatedAt());
                    Teacher savedTeacher = teacherRepo.save(teacher);
                    return ResponseEntity.ok(savedTeacher);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Add Teachers By CSV
    @PostMapping("/csv")
    public ResponseEntity<?> uploadTeacher(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("CSV file is empty!");
        }

        List<Teacher> teachers = new ArrayList<>();
        List<String> errors = new ArrayList<>();
        Set<String> emails = new HashSet<>();
        Set<String> registrationNumbers = new HashSet<>();

        try (BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            String line;
            boolean firstLine = true;
            int rowNumber = 1; // Track row number for better error reporting

            while ((line = br.readLine()) != null) {
                if (firstLine) {
                    firstLine = false;
                    continue; // Skip header line
                }
                rowNumber++; // Increment row number

                String[] data = line.split(",");

                if (data.length < 4) {
                    errors.add("Row " + rowNumber + ": Invalid file format or missing fields.");
                    continue;
                }

                String fullName = data[0].trim();
                String email = data[1].trim();
                String password = passwordEncoder.encode(data[2].trim());
                String registrationNumber = data[3].trim();

                // ✅ Check for duplicate email (DB & CSV)
                if (teacherRepo.existsByEmail(email)) {
                    errors.add("Row " + rowNumber + ": Duplicate email found in database: " + email);
                } else if (!emails.add(email)) {
                    errors.add("Row " + rowNumber + ": Duplicate email found in CSV file: " + email);
                }

                // ✅ Check for duplicate registration number (DB & CSV)
                if (teacherRepo.existsByRegistrationNumber(registrationNumber)) {
                    errors.add("Row " + rowNumber + ": Duplicate registration number found in database: " + registrationNumber);
                } else if (!registrationNumbers.add(registrationNumber)) {
                    errors.add("Row " + rowNumber + ": Duplicate registration number found in CSV file: " + registrationNumber);
                }

                teachers.add(new Teacher(null, fullName, email, password, registrationNumber, new Date()));
            }

            // ✅ If errors exist, return them as a response
            if (!errors.isEmpty()) {
                return ResponseEntity.badRequest().body(errors);
            }

            // ✅ Save teachers if no errors
            teacherRepo.saveAll(teachers);
            return ResponseEntity.status(201).body("Teachers added successfully.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error processing CSV file.");
        }
    }

}
