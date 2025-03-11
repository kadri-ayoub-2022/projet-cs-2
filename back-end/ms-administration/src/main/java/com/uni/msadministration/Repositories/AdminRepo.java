package com.uni.msadministration.Repositories;

import com.uni.msadministration.Entities.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminRepo extends JpaRepository<Admin,Long> {
    Optional<Admin> findByEmail(String email);

        boolean existsByEmail(String email);

}
