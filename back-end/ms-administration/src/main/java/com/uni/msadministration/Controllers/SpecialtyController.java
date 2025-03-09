package com.uni.msadministration.Controllers;

import com.uni.msadministration.Entities.Specialty;
import com.uni.msadministration.Repositories.SpecialtyRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/specialty")
@RequiredArgsConstructor
public class SpecialtyController {

    private final SpecialtyRepo specialtyRepo;

    @GetMapping("")
    public List<Specialty> getAllSpecialties() {
        return specialtyRepo.findAll();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSpecialty(@PathVariable Long id) {
        if (!specialtyRepo.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Specialty not found");
        }
        specialtyRepo.deleteById(id);
        return ResponseEntity.ok("Specialty deleted successfully");
    }

    @PostMapping("")
    public ResponseEntity<?> addSpecialty(@RequestBody Specialty specialty) {
        if (specialtyRepo.existsByAcronym(specialty.getAcronym())) {
            return ResponseEntity.badRequest().body("Specialty with acronym " + specialty.getAcronym() + " already exists.");
        }

        specialtyRepo.save(specialty);
        return ResponseEntity.status(201).body("Specialty added successfully.");
    }

    // Update Specialty By ID
    @PutMapping("/{id}")
    public ResponseEntity<Specialty> updateSpecialty(@PathVariable Long id, @RequestBody Specialty updatedSpecialty) {
        return specialtyRepo.findById(id)
                .map(specialty -> {
                    specialty.setName(updatedSpecialty.getName());
                    specialty.setAcronym(updatedSpecialty.getAcronym());
                    Specialty savedSpecialty = specialtyRepo.save(specialty);
                    return ResponseEntity.ok(savedSpecialty);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

}
