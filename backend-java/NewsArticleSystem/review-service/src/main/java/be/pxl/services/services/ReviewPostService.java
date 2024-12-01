package be.pxl.services.services;

import be.pxl.services.controller.dto.ReviewPostDTO;
import be.pxl.services.domain.ReviewPost;
import be.pxl.services.feign.NotificationClient;
import be.pxl.services.feign.NotificationRequest;
import be.pxl.services.repository.ReviewPostRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ReviewPostService {

    private final ReviewPostRepository reviewPostRepository;
    private final RabbitTemplate rabbitTemplate;
    private final NotificationClient notificationClient;

    @Autowired
    public ReviewPostService(ReviewPostRepository reviewPostRepository, RabbitTemplate rabbitTemplate, NotificationClient notificationClient) {
        this.reviewPostRepository = reviewPostRepository;
        this.rabbitTemplate = rabbitTemplate;
        this.notificationClient = notificationClient;
    }

    @RabbitListener(queues = "myQueue")
    public void receiveFromPostService(ReviewPostDTO reviewPostDTO) {
        System.out.println("Received from post service: " + reviewPostDTO.getTitle() + reviewPostDTO.getContent() + reviewPostDTO.getAuthor());

        if (reviewPostRepository.findById(UUID.fromString(reviewPostDTO.getId())).isPresent()) {
            return;
        }
        ReviewPost reviewPost = ReviewPost.builder()
                .id(UUID.fromString(reviewPostDTO.getId()))
                .title(reviewPostDTO.getTitle())
                .content(reviewPostDTO.getContent())
                .author(reviewPostDTO.getAuthor())
                .creationDate(reviewPostDTO.getCreationDate())
                .approved(reviewPostDTO.isApproved())
                .rejectedReason("")
                .build();
        reviewPostRepository.save(reviewPost);
    }

    @Transactional
    public ReviewPost updateReviewStatus(UUID id, boolean approved, String rejectedReason) {
        ReviewPost reviewPost = reviewPostRepository.findById(id).orElseThrow();
        reviewPost.setApproved(approved);
        System.out.println("Post approved: " + reviewPost.isApproved());
        reviewPost.setRejectedReason(rejectedReason);
        System.out.println("Post rejected reason: " + reviewPost.getRejectedReason());
        reviewPostRepository.save(reviewPost);
        sendToPostService(reviewPost);
        NotificationRequest notificationRequest = NotificationRequest.builder()
                .content("Your post has been reviewed")
                .sender("review-service")
                .postId(String.valueOf(reviewPost.getId()))
                .build();
        notificationClient.sendNotification(notificationRequest);
        reviewPostRepository.delete(reviewPost);
        return reviewPost;
    }

    public ReviewPostDTO getPostById(UUID id) {
        ReviewPost reviewPost = reviewPostRepository.findById(id).orElseThrow();
        return ReviewPostDTO.builder()
                .id(String.valueOf(reviewPost.getId()))
                .title(reviewPost.getTitle())
                .content(reviewPost.getContent())
                .author(reviewPost.getAuthor())
                .creationDate(reviewPost.getCreationDate())
                .approved(reviewPost.isApproved())
                .rejectedReason(reviewPost.getRejectedReason())
                .build();
    }

    public List<ReviewPostDTO> getPostsToReview() {
        return reviewPostRepository.findAll().stream()
                .map(post -> ReviewPostDTO.builder()
                        .id(String.valueOf(post.getId()))
                        .title(post.getTitle())
                        .content(post.getContent())
                        .author(post.getAuthor())
                        .creationDate(post.getCreationDate())
                        .approved(post.isApproved())
                        .rejectedReason(post.getRejectedReason())
                        .build())
                .collect(Collectors.toList());
    }

    private void sendToPostService(ReviewPost reviewPost) {
        ReviewPostDTO reviewPostDTO = ReviewPostDTO.builder()
                .id(String.valueOf(reviewPost.getId()))
                .title(reviewPost.getTitle())
                .content(reviewPost.getContent())
                .author(reviewPost.getAuthor())
                .creationDate(reviewPost.getCreationDate())
                .approved(reviewPost.isApproved())
                .rejectedReason(reviewPost.getRejectedReason())
                .build();
        rabbitTemplate.convertAndSend("myQueue", reviewPostDTO);
        System.out.println("Post sent to post service: " + reviewPostDTO.getTitle() + reviewPostDTO.getContent() + reviewPostDTO.getAuthor());
    }
}