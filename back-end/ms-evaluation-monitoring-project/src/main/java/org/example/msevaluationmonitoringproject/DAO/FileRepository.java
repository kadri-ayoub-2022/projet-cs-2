package org.example.msevaluationmonitoringproject.DAO;

import org.example.msevaluationmonitoringproject.DTO.*;
import org.example.msevaluationmonitoringproject.Entities.File;
import org.example.msevaluationmonitoringproject.Entities.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileRepository extends JpaRepository<File,Long> {
    List<File> findByTask_TaskId(Long taskTaskId);
}
