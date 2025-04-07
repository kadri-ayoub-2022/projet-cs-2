package org.example.msevaluationmonitoringproject.Controller;

import lombok.RequiredArgsConstructor;
import org.example.msevaluationmonitoringproject.DAO.CommentRepository;
import org.example.msevaluationmonitoringproject.DTO.CommentRequestDTO;
import org.example.msevaluationmonitoringproject.DTO.CommetUpdateDTO;
import org.example.msevaluationmonitoringproject.Entities.Comment;
import org.example.msevaluationmonitoringproject.Services.CommentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    public ResponseEntity<?> createComment(@RequestBody CommentRequestDTO dto, @RequestHeader("Authorization") String token) {
        try {
            Comment savedComment = commentService.createComment(dto,token);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedComment);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<?> updateComment(@PathVariable Long commentId, @RequestBody CommetUpdateDTO dto,@RequestHeader("Authorization") String token) {
        try {
            Comment updatedComment = commentService.updateComment(commentId, dto,token);
            return ResponseEntity.ok(updatedComment);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable Long commentId,@RequestHeader("Authorization") String token) {
        try {
            commentService.deleteComment(commentId,token);
            return ResponseEntity.ok("Comment deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }




}
