package be.pxl.services;

import be.pxl.services.controller.request.PostRequest;
import be.pxl.services.controller.request.PostUpdateRequest;
import be.pxl.services.domain.Post;
import be.pxl.services.repository.PostRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@Testcontainers
@AutoConfigureMockMvc
@Sql("/sql/schema.sql")
public class PostTests {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private PostRepository postRepository;

    @Container
    private static MySQLContainer sqlContainer = new MySQLContainer<>("mysql:5.7.37");

    @DynamicPropertySource
    static void setDatasourceProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", sqlContainer::getJdbcUrl);
        registry.add("spring.datasource.username", sqlContainer::getUsername);
        registry.add("spring.datasource.password", sqlContainer::getPassword);
    }

    @BeforeEach
    public void setup() {
        postRepository.deleteAll();
    }

    @Test
    public void testGetApprovedPosts() throws Exception {
        mockMvc.perform(get("/api/posts/approved")
                        .header("Role", "admin"))
                .andExpect(status().isOk());
    }

    @Test
    public void testAddPost() throws Exception {
        PostRequest postRequest = new PostRequest("Title", "Content", "Author", true);
        mockMvc.perform(post("/api/posts")
                        .header("Role", "admin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(postRequest)))
                .andExpect(status().isOk());

        Post savedPost = postRepository.findAll().get(0);
        assertEquals(postRequest.getTitle(), savedPost.getTitle());
        assertEquals(postRequest.getContent(), savedPost.getContent());
        assertEquals(postRequest.getAuthor(), savedPost.getAuthor());
        assertTrue(savedPost.isConcept());
    }

    @Test
    public void testUpdatePost() throws Exception {
        Post post = new Post(UUID.randomUUID(), "Title", "Content", "Author", LocalDateTime.now(), true, false, "");
        postRepository.save(post);

        PostUpdateRequest postUpdateRequest = new PostUpdateRequest("Updated Title", "Updated Content", post.getId().toString(), true);
        mockMvc.perform(put("/api/posts/update")
                        .header("Role", "admin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(postUpdateRequest)))
                .andExpect(status().isOk());

        Post updatedPost = postRepository.findById(post.getId()).orElseThrow();
        assertEquals(postUpdateRequest.getTitle(), updatedPost.getTitle());
        assertEquals(postUpdateRequest.getContent(), updatedPost.getContent());
    }

    @Test
    public void testGetApprovedRejectedPosts() throws Exception {
        mockMvc.perform(get("/api/posts/approved-rejected")
                        .header("Role", "admin")
                        .header("Username", "Author"))
                .andExpect(status().isOk());
    }

    @Test
    public void testGetFinishedPosts() throws Exception {
        mockMvc.perform(get("/api/posts")
                        .header("Role", "admin")
                        .header("Username", "Author"))
                .andExpect(status().isOk());
    }

    @Test
    public void testGetPost() throws Exception {
        Post post = new Post(UUID.randomUUID(), "Title", "Content", "Author", LocalDateTime.now(), true, false, "");
        postRepository.save(post);

        mockMvc.perform(get("/api/posts/" + post.getId())
                        .header("Role", "admin"))
                .andExpect(status().isOk());
    }

    @Test
    public void testGetConceptPosts() throws Exception {
        mockMvc.perform(get("/api/posts/concepts")
                        .header("Role", "admin")
                        .header("Username", "Author"))
                .andExpect(status().isOk());
    }

    @Test
    public void testDeletePost() throws Exception {
        Post post = new Post(UUID.randomUUID(), "Title", "Content", "Author", LocalDateTime.now(), true, false, "");
        postRepository.save(post);

        mockMvc.perform(delete("/api/posts/" + post.getId())
                        .header("Role", "admin"))
                .andExpect(status().isOk());

        assertTrue(postRepository.findById(post.getId()).isEmpty());
    }
}