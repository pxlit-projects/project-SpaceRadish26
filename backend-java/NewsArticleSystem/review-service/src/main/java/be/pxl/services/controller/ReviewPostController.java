package be.pxl.services.controller;

import be.pxl.services.controller.dto.ReviewPostDTO;
import be.pxl.services.domain.ReviewPost;
import be.pxl.services.services.ReviewPostService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/review")
public class ReviewPostController {

    private final ReviewPostService reviewPostService;

    public ReviewPostController(ReviewPostService reviewPostService) {
        this.reviewPostService = reviewPostService;
    }



    @GetMapping("/{id}")
    public ResponseEntity<ReviewPostDTO> getPostById(@PathVariable String id) {
        return ResponseEntity.ok(reviewPostService.getPostById(UUID.fromString(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReviewPost> updatePostReviewStatus(@PathVariable String id, @RequestBody ReviewPostDTO reviewPostDTO) {
        return ResponseEntity.ok(reviewPostService.updateReviewStatus(UUID.fromString(id), reviewPostDTO.isApproved(), reviewPostDTO.getRejectedReason()));
    }

    @GetMapping
    public ResponseEntity<List<ReviewPostDTO>> getPostsToReview() {
        return ResponseEntity.ok(reviewPostService.getPostsToReview());
    }
}