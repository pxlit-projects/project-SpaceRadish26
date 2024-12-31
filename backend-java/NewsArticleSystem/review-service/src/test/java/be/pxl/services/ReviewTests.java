package be.pxl.services;

import be.pxl.services.controller.dto.ReviewPostDTO;
import be.pxl.services.domain.ReviewPost;
import be.pxl.services.feign.NotificationClient;
import be.pxl.services.repository.ReviewPostRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@Testcontainers
@AutoConfigureMockMvc
@Sql("/sql/schema.sql")
public class ReviewTests {

    @Autowired
    MockMvc mockMvc;

    @MockBean
    private RabbitTemplate rabbitTemplate;

    @MockBean
    private NotificationClient notificationClient;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ReviewPostRepository reviewPostRepository;

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
        reviewPostRepository.deleteAll();
        doNothing().when(notificationClient).sendNotification(any());
    }

    @Test
    public void testGetPostById() throws Exception {
        ReviewPost reviewPost = new ReviewPost(UUID.randomUUID(), "Title", "Content", "Author", "2023-01-01", false, "");
        reviewPostRepository.save(reviewPost);

        mockMvc.perform(get("/api/review/" + reviewPost.getId())
                        .header("Role", "admin"))
                .andExpect(status().isOk());
    }

    @Test
    public void testUpdatePostReviewStatus() throws Exception {
        ReviewPost reviewPost = new ReviewPost(UUID.randomUUID(), "Title", "Content", "Author", "2023-01-01", false, "");
        reviewPostRepository.save(reviewPost);

        ReviewPostDTO reviewPostDTO = new ReviewPostDTO(reviewPost.getId().toString(), "Title", "Content", "Author", "2023-01-01", true, "Rejected Reason");
        mockMvc.perform(put("/api/review/" + reviewPost.getId())
                        .header("Role", "admin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reviewPostDTO)))
                .andExpect(status().isOk());
    }

    @Test
    public void testGetPostsToReview() throws Exception {
        mockMvc.perform(get("/api/review")
                        .header("Role", "admin"))
                .andExpect(status().isOk());
    }
}