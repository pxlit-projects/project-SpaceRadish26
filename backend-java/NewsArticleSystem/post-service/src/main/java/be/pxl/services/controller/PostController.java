package be.pxl.services.controller;

import be.pxl.services.controller.request.PostRequest;
import be.pxl.services.controller.request.PostUpdateRequest;
import be.pxl.services.services.PostService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final List<String> allowedRoles = List.of("admin", "writer", "guest", "reader");

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }


    @GetMapping("/approved")
    public ResponseEntity<?> getApprovedPosts(@RequestHeader("Role") String role) {
        if (allowedRoles.contains(role)) {
            return ResponseEntity.ok(postService.getApprovedPosts());
        }
        else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @PostMapping
    public ResponseEntity<?> addPost(@Valid @RequestBody PostRequest postRequest, @RequestHeader("Role") String role) {
        if (role.equals("admin") || role.equals("writer")) {
            postService.addPost(postRequest);
        }
        else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok().build();
    }

    @PutMapping("/update")
    public ResponseEntity<?> updatePost(@Valid @RequestBody PostUpdateRequest postUpdateRequest, @RequestHeader("Role") String role) {
        if (role.equals("admin") || role.equals("writer")) {
            postService.updatePost(postUpdateRequest);
        }
        else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("/approved-rejected")
    public ResponseEntity<?> getApprovedRejectedPosts(@RequestHeader("Role") String role, @RequestHeader("Username") String username) {
        if (allowedRoles.contains(role)) {
            return ResponseEntity.ok(postService.getApprovedRejectedPosts(username));
        }
        else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

    }

    @GetMapping
    public ResponseEntity<?> getFinishedPosts(@RequestHeader("Role") String role, @RequestHeader("Username") String username) {
        if (allowedRoles.contains(role)) {
            return ResponseEntity.ok(postService.getFinishedPosts(username));
        }
        else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPost(@PathVariable String id, @RequestHeader("Role") String role) {
        if (allowedRoles.contains(role)) {
            return ResponseEntity.ok(postService.getPost(UUID.fromString(id)));
        }
        else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @GetMapping("/concepts")
    public ResponseEntity<?> getConceptPosts(@RequestHeader("Role") String role, @RequestHeader("Username") String username) {
        if (allowedRoles.contains(role)) {
            return ResponseEntity.ok(postService.getConceptPosts(username));
        }
        else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable String id, @RequestHeader("Role") String role) {
        if (role.equals("admin") || role.equals("writer")) {
            postService.deletePost(UUID.fromString(id));
        }
        else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok().build();
    }
}