package com.uni.msauthentication.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ser.FilterProvider;
import com.fasterxml.jackson.databind.ser.impl.SimpleBeanPropertyFilter;
import com.fasterxml.jackson.databind.ser.impl.SimpleFilterProvider;
import com.uni.msauthentication.DTO.AdminDTO;
import com.uni.msauthentication.DTO.StudentDTO;
import com.uni.msauthentication.DTO.TeacherDTO;
import com.uni.msauthentication.Exception.InvalidCredentialsException;
import com.uni.msauthentication.Exception.UserNotFoundException;

import com.uni.msauthentication.Proxies.UserProxy;
import com.uni.msauthentication.config.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.logging.Logger;

@RequiredArgsConstructor
@Service
public class AuthService {

    private final UserProxy userProxy;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;
    private final ObjectMapper objectMapper;

    public void sendPasswordResetToken(String email) {
        Object user = findUserByEmail(email);
        if (user == null) {
            throw new RuntimeException("Email not found");
        }

        String token = jwtUtil.generateResetToken(email);
        emailService.sendPasswordResetEmail(email, token);
    }

    public Object findUserByEmail(String email) {
        try {
            ResponseEntity<AdminDTO> adminResponse = userProxy.getAdminByEmail(email);
            if (adminResponse.getBody() != null) return adminResponse.getBody();
        } catch (Exception ignored) {}

        try {
            ResponseEntity<TeacherDTO> teacherResponse = userProxy.getTeacherByEmail(email);
            if (teacherResponse.getBody() != null) return teacherResponse.getBody();
        } catch (Exception ignored) {}

        try {
            ResponseEntity<StudentDTO> studentResponse = userProxy.getStudentByEmail(email);
            if (studentResponse.getBody() != null) return studentResponse.getBody();
        } catch (Exception ignored) {}

        return null;
    }

    public String getPassword(Object user) {
        if (user instanceof AdminDTO) return ((AdminDTO) user).getPassword();
        if (user instanceof TeacherDTO) return ((TeacherDTO) user).getPassword();
        if (user instanceof StudentDTO) return ((StudentDTO) user).getPassword();
        return null;
    }

    public String getRole(Object user) {
        if (user instanceof AdminDTO) return "admin";
        if (user instanceof TeacherDTO) return "teacher";
        if (user instanceof StudentDTO) return "student";
        return "UNKNOWN";
    }
    public Object filterUserWithoutPassword(Object user) {
        try {
            SimpleBeanPropertyFilter filter = SimpleBeanPropertyFilter.serializeAllExcept("password");
            FilterProvider filters = new SimpleFilterProvider().addFilter("userFilter", filter);
            String filteredUserJson = objectMapper.writer(filters).writeValueAsString(user);
            return objectMapper.readValue(filteredUserJson, Object.class);
        } catch (JsonProcessingException e) {
            // Log the error if you have a logger, e.g., log.error("Failed to filter user", e);
            return null; // Or throw an exception if preferred
        }
    }

//    private static final Logger LOGGER = Logger.getLogger(AuthService.class.getName());
//
//
//    private final BCryptPasswordEncoder passwordEncoder;
//    private final RestTemplate restTemplate;
//    private final JwtUtil jwtUtil;
//
//
//
//    public String login(String email, String password) {
//        String role = null;
//
//        Admin admin = adminRepository.findByEmail(email).orElse(null);
//        if (admin != null && passwordEncoder.matches(password, admin.getPassword())) {
//            role = "admin";
//        } else {
//            Teacher teacher = teacherRepository.findByEmail(email).orElse(null);
//            if (teacher != null && passwordEncoder.matches(password, teacher.getPassword())) {
//                role = "teacher";
//            } else {
//                Student student = studentRepository.findByEmail(email).orElse(null);
//                if (student != null && passwordEncoder.matches(password, student.getPassword())) {
//                    role = "student";
//                }
//            }
//        }
//
//        if (role == null) {
//            LOGGER.warning("Invalid email or password for: " + email);
//            throw new InvalidCredentialsException("Invalid email or password");
//        }
//
//        LOGGER.info("Generating token for email: " + email + ", role: " + role);
//        return jwtUtil.generateToken(email, role);
//    }
//
//    public boolean isEmailRegistered(String email) {
//        boolean exists = adminRepository.findByEmail(email).isPresent() ||
//                teacherRepository.findByEmail(email).isPresent() ||
//                studentRepository.findByEmail(email).isPresent();
//        if (!exists) {
//            LOGGER.warning("Email not registered: " + email);
//            throw new UserNotFoundException("Email is not registered");
//        }
//        return true;
//    }
//
//    public void updateUserPassword(String email, String newPassword) {
//        Admin admin = adminRepository.findByEmail(email).orElse(null);
//        if (admin != null) {
//            admin.setPassword(newPassword);
//            adminRepository.save(admin);
//            return;
//        }
//
//        Teacher teacher = teacherRepository.findByEmail(email).orElse(null);
//        if (teacher != null) {
//            teacher.setPassword(newPassword);
//            teacherRepository.save(teacher);
//            return;
//        }
//
//        Student student = studentRepository.findByEmail(email).orElse(null);
//        if (student != null) {
//            student.setPassword(newPassword);
//            studentRepository.save(student);
//            return;
//        }
//
//        throw new UserNotFoundException("User not found for email: " + email);
//    }
//

}