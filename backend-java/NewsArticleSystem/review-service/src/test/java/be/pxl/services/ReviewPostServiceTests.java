package be.pxl.services;

import be.pxl.services.controller.dto.ReviewPostDTO;
import be.pxl.services.domain.ReviewPost;
import be.pxl.services.feign.NotificationClient;
import be.pxl.services.feign.NotificationRequest;
import be.pxl.services.repository.ReviewPostRepository;
import be.pxl.services.services.ReviewPostService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class ReviewPostServiceTests {

    @Mock
    private ReviewPostRepository reviewPostRepository;

    @Mock
    private RabbitTemplate rabbitTemplate;

    @Mock
    private NotificationClient notificationClient;

    @InjectMocks
    private ReviewPostService reviewPostService;

    @Captor
    private ArgumentCaptor<ReviewPost> reviewPostCaptor;

    @Captor
    private ArgumentCaptor<NotificationRequest> notificationRequestCaptor;

    private ReviewPost reviewPost;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        reviewPost = ReviewPost.builder()
                .id(UUID.randomUUID())
                .title("Title")
                .content("Content")
                .author("Author")
                .creationDate("2023-01-01")
                .approved(false)
                .rejectedReason("")
                .build();
    }

    @Test
    public void testReceiveFromPostService() {
        ReviewPostDTO reviewPostDTO = ReviewPostDTO.builder()
                .id(reviewPost.getId().toString())
                .title("Title")
                .content("Content")
                .author("Author")
                .creationDate("2023-01-01")
                .approved(false)
                .build();

        when(reviewPostRepository.findById(any(UUID.class))).thenReturn(Optional.empty());

        reviewPostService.receiveFromPostService(reviewPostDTO);

        verify(reviewPostRepository).save(reviewPostCaptor.capture());
        ReviewPost savedReviewPost = reviewPostCaptor.getValue();
        assertEquals(reviewPostDTO.getId(), savedReviewPost.getId().toString());
        assertEquals(reviewPostDTO.getTitle(), savedReviewPost.getTitle());
        assertEquals(reviewPostDTO.getContent(), savedReviewPost.getContent());
        assertEquals(reviewPostDTO.getAuthor(), savedReviewPost.getAuthor());
        assertEquals(reviewPostDTO.getCreationDate(), savedReviewPost.getCreationDate());
        assertFalse(savedReviewPost.isApproved());
    }

    @Test
    public void testUpdateReviewStatus() {
        when(reviewPostRepository.findById(any(UUID.class))).thenReturn(Optional.of(reviewPost));

        ReviewPost updatedReviewPost = reviewPostService.updateReviewStatus(reviewPost.getId(), true, "Rejected Reason");

        verify(reviewPostRepository).save(reviewPostCaptor.capture());
        verify(notificationClient).sendNotification(notificationRequestCaptor.capture());
        ReviewPost savedReviewPost = reviewPostCaptor.getValue();
        NotificationRequest sentNotificationRequest = notificationRequestCaptor.getValue();

        assertTrue(savedReviewPost.isApproved());
        assertEquals("Rejected Reason", savedReviewPost.getRejectedReason());
        assertEquals("Your post has been reviewed", sentNotificationRequest.getContent());
        assertEquals("review-service", sentNotificationRequest.getSender());
        assertEquals(reviewPost.getId().toString(), sentNotificationRequest.getPostId());
        assertEquals(reviewPost.getId(), updatedReviewPost.getId());
    }

    @Test
    public void testGetPostById() {
        when(reviewPostRepository.findById(any(UUID.class))).thenReturn(Optional.of(reviewPost));

        ReviewPostDTO reviewPostDTO = reviewPostService.getPostById(reviewPost.getId());

        assertEquals(reviewPost.getId().toString(), reviewPostDTO.getId());
        assertEquals(reviewPost.getTitle(), reviewPostDTO.getTitle());
        assertEquals(reviewPost.getContent(), reviewPostDTO.getContent());
        assertEquals(reviewPost.getAuthor(), reviewPostDTO.getAuthor());
        assertEquals(reviewPost.getCreationDate(), reviewPostDTO.getCreationDate());
        assertFalse(reviewPostDTO.isApproved());
        assertEquals(reviewPost.getRejectedReason(), reviewPostDTO.getRejectedReason());
    }

    @Test
    public void testGetPostsToReview() {
        when(reviewPostRepository.findAll()).thenReturn(List.of(reviewPost));

        List<ReviewPostDTO> reviewPostDTOs = reviewPostService.getPostsToReview();

        assertEquals(1, reviewPostDTOs.size());
        ReviewPostDTO reviewPostDTO = reviewPostDTOs.getFirst();
        assertEquals(reviewPost.getId().toString(), reviewPostDTO.getId());
        assertEquals(reviewPost.getTitle(), reviewPostDTO.getTitle());
        assertEquals(reviewPost.getContent(), reviewPostDTO.getContent());
        assertEquals(reviewPost.getAuthor(), reviewPostDTO.getAuthor());
        assertEquals(reviewPost.getCreationDate(), reviewPostDTO.getCreationDate());
        assertFalse(reviewPostDTO.isApproved());
        assertEquals(reviewPost.getRejectedReason(), reviewPostDTO.getRejectedReason());
    }

    @Test
    public void testSendToPostService() {
        reviewPostService.sendToPostService(reviewPost);

        verify(rabbitTemplate).convertAndSend(eq("myQueue"), any(ReviewPostDTO.class));
    }
}