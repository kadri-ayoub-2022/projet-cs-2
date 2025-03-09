package com.uni.msadministration.Repositories;

import com.uni.msadministration.Entities.Specialty;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SpecialtyRepo extends JpaRepository<Specialty,Long> {
    Optional<Specialty> findByAcronym(String acronym);
    boolean existsByAcronym(String acronym);

}
