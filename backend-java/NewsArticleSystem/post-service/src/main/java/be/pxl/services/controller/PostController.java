package be.pxl.services.controller;

import be.pxl.services.controller.request.PostRequest;
import be.pxl.services.controller.request.PostUpdateRequest;
import be.pxl.services.services.PostService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
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
            System.out.println(postUpdateRequest);
            System.out.println(postUpdateRequest.isConcept());
            postService.updatePost(postUpdateRequest);
        }
        else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<?> getFinishedPosts(@RequestHeader("Role") String role) {
        if (!role.isBlank()) {
            return ResponseEntity.ok(postService.getFinishedPosts());
        }
        else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPost(@PathVariable Long id, @RequestHeader("Role") String role) {
        if (!role.isBlank()) {
            return ResponseEntity.ok(postService.getPost(id));
        }
        else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @GetMapping("/concepts")
    public ResponseEntity<?> getConceptPosts(@RequestHeader("Role") String role, @RequestHeader("Username") String username) {
        if (!role.isBlank()) {
            return ResponseEntity.ok(postService.getConceptPosts(username));
        }
        else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable Long id, @RequestHeader("Role") String role) {
        if (role.equals("admin") || role.equals("writer")) {
            postService.deletePost(id);
        }
        else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok().build();
    }
}