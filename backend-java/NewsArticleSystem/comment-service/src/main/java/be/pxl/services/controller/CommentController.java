package be.pxl.services.controller;

import be.pxl.services.controller.dto.CommentDto;
import be.pxl.services.controller.request.CommentRequest;
import be.pxl.services.controller.request.UpdateCommentRequest;
import be.pxl.services.services.CommentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/comments")
public class CommentController {


    private final List<String> allowedRoles = List.of("admin", "writer", "guest", "reader");
    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping("/{id}")
    public List<CommentDto> getComments(@PathVariable String id) {
        return commentService.getCommentsByPostId(UUID.fromString(id));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteComment(@PathVariable String id, @RequestHeader("Role") String role, @RequestHeader("Username") String user) {
        if (role.equals("admin") || role.equals("writer") || role.equals("reader")) {
            commentService.deleteComment(UUID.fromString(id), user);
        }
        return ResponseEntity.accepted().build();
    }

    @PostMapping("/create")
    public ResponseEntity<?> createComment(@RequestBody CommentRequest commentRequest) {
        commentService.createComment(commentRequest);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateComment(@PathVariable String id, @RequestBody UpdateCommentRequest commentDto, @RequestHeader("Role") String role, @RequestHeader("Username") String user) {
        if (role.equals("admin") || role.equals("writer") || role.equals("reader")) {
            commentDto.setId(id);
            commentService.updateComment(commentDto, user);
        }
        return ResponseEntity.ok().build();
    }
}
