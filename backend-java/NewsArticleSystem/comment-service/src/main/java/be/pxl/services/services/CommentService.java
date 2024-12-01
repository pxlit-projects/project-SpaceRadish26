package be.pxl.services.services;

import be.pxl.services.controller.dto.CommentDto;
import be.pxl.services.controller.request.CommentRequest;
import be.pxl.services.controller.request.UpdateCommentRequest;
import be.pxl.services.domain.Comment;
import be.pxl.services.repository.CommentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class CommentService {

    private final CommentRepository commentRepository;

    public CommentService(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    public List<CommentDto> getCommentsByPostId(UUID postId) {
        return commentRepository.findByPostId(postId).stream().map(comment -> CommentDto.builder()
                .id(String.valueOf(comment.getId()))
                .postId(String.valueOf(comment.getPostId()))
                .content(comment.getContent())
                .author(comment.getAuthor())
                .build()).toList();
    }

    public Comment createComment(CommentRequest comment) {
        Comment commentToSave = Comment.builder()
                .id(UUID.randomUUID())
                .postId(UUID.fromString(comment.getPostId()))
                .content(comment.getContent())
                .author(comment.getAuthor())
                .build();
        return commentRepository.save(commentToSave);
    }

    public void deleteComment(UUID id) {
        commentRepository.deleteById(id);
    }

    public void updateComment(UpdateCommentRequest comment) {
        Comment commentToUpdate = commentRepository.findById(UUID.fromString(comment.getId())).orElseThrow();
        commentToUpdate.setContent(comment.getContent());
        commentRepository.save(commentToUpdate);
    }


}
