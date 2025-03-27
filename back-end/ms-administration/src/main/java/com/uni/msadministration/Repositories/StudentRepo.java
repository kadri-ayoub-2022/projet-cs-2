package com.uni.msadministration.Repositories;

import com.uni.msadministration.Entities.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentRepo extends JpaRepository<Student, Long> {
    boolean existsByEmail(String email);
    boolean existsByRegistrationNumber(String registrationNumber);
    Optional<Student> findByEmail(String email);

    @Override
    void deleteById(Long id);

    void deleteByStudentIdIn(List<Long> ids);
}
