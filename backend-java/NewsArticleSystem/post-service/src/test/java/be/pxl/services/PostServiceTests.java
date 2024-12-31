package be.pxl.services;

import be.pxl.services.controller.dto.PostDTO;
import be.pxl.services.controller.dto.ReviewPostDTO;
import be.pxl.services.controller.request.PostRequest;
import be.pxl.services.controller.request.PostUpdateRequest;
import be.pxl.services.domain.Post;
import be.pxl.services.exception.ConceptException;
import be.pxl.services.repository.PostRepository;
import be.pxl.services.services.PostService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class PostServiceTests {

    @Mock
    private PostRepository postRepository;

    @Mock
    private RabbitTemplate rabbitTemplate;

    @InjectMocks
    private PostService postService;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testDeletePost() {
        UUID id = UUID.randomUUID();
        postService.deletePost(id);
        verify(postRepository, times(1)).deleteById(id);
    }

    @Test
    public void testSendForApproval() {
        UUID id = UUID.randomUUID();
        Post post = new Post(id, "Title", "Content", "Author", LocalDateTime.now(), false, false, "");
        when(postRepository.findById(id)).thenReturn(Optional.of(post));

        postService.sendForApproval(id);

        ArgumentCaptor<ReviewPostDTO> captor = ArgumentCaptor.forClass(ReviewPostDTO.class);
        verify(rabbitTemplate, times(1)).convertAndSend(eq("myQueue"), captor.capture());
        ReviewPostDTO sentPost = captor.getValue();
        assertEquals(post.getId(), sentPost.getId());
        assertEquals(post.getTitle(), sentPost.getTitle());
        assertEquals(post.getContent(), sentPost.getContent());
    }

    @Test
    public void testSendForApprovalThrowsConceptException() {
        UUID id = UUID.randomUUID();
        Post post = new Post(id, "Title", "Content", "Author", LocalDateTime.now(), true, false, "");
        when(postRepository.findById(id)).thenReturn(Optional.of(post));

        assertThrows(ConceptException.class, () -> postService.sendForApproval(id));
    }

    @Test
    public void testGetReviewedPost() {
        UUID id = UUID.randomUUID();
        Post post = new Post(id, "Title", "Content", "Author", LocalDateTime.now(), false, false, "");
        when(postRepository.findById(id)).thenReturn(Optional.of(post));

        ReviewPostDTO reviewPostDTO = ReviewPostDTO.builder()
                .id(id)
                .title("Title")
                .content("Content")
                .author("Author")
                .creationDate(LocalDateTime.now().toString())
                .approved(true)
                .rejectedReason("")
                .build();

        postService.getReviewedPost(reviewPostDTO);

        verify(postRepository, times(1)).save(post);
        assertTrue(post.isApproved());
    }

    @Test
    public void testUpdatePost() {
        UUID id = UUID.randomUUID();
        Post post = new Post(id, "Title", "Content", "Author", LocalDateTime.now(), false, false, "");
        when(postRepository.findById(id)).thenReturn(Optional.of(post));

        PostUpdateRequest postUpdateRequest = new PostUpdateRequest( "Updated Title", "Updated Content", id.toString(),false);
        postService.updatePost(postUpdateRequest);

        verify(postRepository, times(1)).save(post);
        assertEquals("Updated Title", post.getTitle());
        assertEquals("Updated Content", post.getContent());
    }

    @Test
    public void testGetFinishedPosts() {
        String username = "Author";
        Post post = new Post(UUID.randomUUID(), "Title", "Content", username, LocalDateTime.now(), false, false, "");
        when(postRepository.findByAuthorAndConcept(username, false)).thenReturn(List.of(post));

        List<PostDTO> posts = postService.getFinishedPosts(username);

        assertEquals(1, posts.size());
        assertEquals(post.getTitle(), posts.get(0).getTitle());
    }

    @Test
    public void testGetConceptPosts() {
        String username = "Author";
        Post post = new Post(UUID.randomUUID(), "Title", "Content", username, LocalDateTime.now(), true, false, "");
        when(postRepository.findByAuthorAndConcept(username, true)).thenReturn(List.of(post));

        List<PostDTO> posts = postService.getConceptPosts(username);

        assertEquals(1, posts.size());
        assertEquals(post.getTitle(), posts.get(0).getTitle());
    }

    @Test
    public void testAddPost() {
        PostRequest postRequest = new PostRequest("Title", "Content", "Author", true);
        postService.addPost(postRequest);

        ArgumentCaptor<Post> captor = ArgumentCaptor.forClass(Post.class);
        verify(postRepository, times(1)).save(captor.capture());
        Post savedPost = captor.getValue();
        assertEquals(postRequest.getTitle(), savedPost.getTitle());
        assertEquals(postRequest.getContent(), savedPost.getContent());
    }

    @Test
    public void testGetPost() {
        UUID id = UUID.randomUUID();
        Post post = new Post(id, "Title", "Content", "Author", LocalDateTime.now(), false, false, "");
        when(postRepository.findById(id)).thenReturn(Optional.of(post));

        PostDTO postDTO = postService.getPost(id);

        assertEquals(post.getTitle(), postDTO.getTitle());
    }

    @Test
    public void testGetApprovedPosts() {
        Post post = new Post(UUID.randomUUID(), "Title", "Content", "Author", LocalDateTime.now(), false, true, "");
        when(postRepository.findByApproved(true)).thenReturn(List.of(post));

        List<PostDTO> posts = postService.getApprovedPosts();

        assertEquals(1, posts.size());
        assertEquals(post.getTitle(), posts.get(0).getTitle());
    }

    @Test
    public void testGetApprovedRejectedPosts() {
        String username = "Author";
        Post post = new Post(UUID.randomUUID(), "Title", "Content", username, LocalDateTime.now(), false, true, "Rejected");
        when(postRepository.findByAuthorAndConcept(username, false)).thenReturn(List.of(post));

        List<ReviewPostDTO> posts = postService.getApprovedRejectedPosts(username);

        assertEquals(1, posts.size());
        assertEquals(post.getTitle(), posts.get(0).getTitle());
    }

    @Test
    public void testGetPostAuthor() {
        UUID id = UUID.randomUUID();
        Post post = new Post(id, "Title", "Content", "Author", LocalDateTime.now(), false, false, "");
        when(postRepository.findById(id)).thenReturn(Optional.of(post));

        String author = postService.getPostAuthor(id);

        assertEquals(post.getAuthor(), author);
    }
}