package org.example.msevaluationmonitoringproject.Services;

import feign.FeignException;
import lombok.RequiredArgsConstructor;
import org.example.msevaluationmonitoringproject.DAO.CommentRepository;
import org.example.msevaluationmonitoringproject.DAO.TaskRepository;
import org.example.msevaluationmonitoringproject.DTO.CommentRequestDTO;
import org.example.msevaluationmonitoringproject.DTO.CommetUpdateDTO;
import org.example.msevaluationmonitoringproject.Entities.Comment;
import org.example.msevaluationmonitoringproject.Entities.Task;
import org.example.msevaluationmonitoringproject.Exception.UnauthorizedException;
import org.example.msevaluationmonitoringproject.Proxy.AuthProxy;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final TaskRepository taskRepository;
    private final AuthProxy authProxy;

    public Comment createComment(CommentRequestDTO dto, String token) {
        ResponseEntity<?> response = null;

        try {
            response = authProxy.getAuthenticatedUser(token);
        } catch (FeignException.Unauthorized e) {
            throw new UnauthorizedException("Invalid or expired token");
        }

        Task task = taskRepository.findById(dto.getTaskId())
                .orElseThrow(() -> new RuntimeException("Task not found"));

        Comment comment = new Comment();
        comment.setContent(dto.getContent());
        comment.setCreatedAt(new Date());
        comment.setTask(task);

        return commentRepository.save(comment);
    }

    public Comment updateComment(Long commentId, CommetUpdateDTO dto, String token) {
        ResponseEntity<?> response = null;

        try {
            response = authProxy.getAuthenticatedUser(token);
        } catch (FeignException.Unauthorized e) {
            throw new UnauthorizedException("Invalid or expired token");
        }


        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (dto.getContent() != null) {
            comment.setContent(dto.getContent());
        }

        // Optional: update createdAt to reflect edit time
        comment.setCreatedAt(new Date());

        return commentRepository.save(comment);
    }

    public void deleteComment(Long commentId, String token) {
        ResponseEntity<?> response = null;

        try {
            response = authProxy.getAuthenticatedUser(token);
        } catch (FeignException.Unauthorized e) {
            throw new UnauthorizedException("Invalid or expired token");
        }


        if (!commentRepository.existsById(commentId)) {
            throw new RuntimeException("Comment not found");
        }
        commentRepository.deleteById(commentId);
    }

}

