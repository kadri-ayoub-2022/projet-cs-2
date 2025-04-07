package org.example.msevaluationmonitoringproject.DAO;

import org.example.msevaluationmonitoringproject.DTO.CommentDTO;
import org.example.msevaluationmonitoringproject.Entities.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment,Long> {
    List<Comment> findByTask_TaskId(Long taskId);
}
