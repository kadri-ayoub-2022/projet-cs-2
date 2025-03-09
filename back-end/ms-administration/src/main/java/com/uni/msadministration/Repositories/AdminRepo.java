package com.uni.msadministration.Repositories;

import com.uni.msadministration.Entities.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepo extends JpaRepository<Admin,Long> {
}
