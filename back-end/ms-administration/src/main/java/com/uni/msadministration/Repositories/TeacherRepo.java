package com.uni.msadministration.Repositories;

import com.uni.msadministration.Entities.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TeacherRepo extends JpaRepository<Teacher,Long> {
    boolean existsByEmail(String email);
    Optional<Teacher> findByEmail(String email);
    boolean existsByRegistrationNumber(String registrationNumber);
}
