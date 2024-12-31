package be.pxl.services;

import be.pxl.services.controller.request.NotificationRequest2;
import be.pxl.services.domain.Notification;
import be.pxl.services.repository.NotificationRepository;
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

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@Testcontainers
@AutoConfigureMockMvc
@Sql("/sql/schema.sql")
public class NotificationTests {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private NotificationRepository notificationRepository;

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
        notificationRepository.deleteAll();
    }

    @Test
    public void testGetNotifications() throws Exception {
        Notification notification = new Notification();
        notification.setId(1L);
        notification.setUserId("user1");
        notification.setContent("Content");
        notification.setPostId("postId");
        notificationRepository.save(notification);

        mockMvc.perform(get("/api/notifications")
                        .header("Role", "admin")
                        .header("Username", "user1"))
                .andExpect(status().isOk());
    }



    @Test
    public void testDeleteNotification() throws Exception {
        Notification notification = new Notification();
        notification.setId(1L);
        notification.setUserId("user1");
        notification.setContent("Content");
        notification.setPostId("postId");
        notificationRepository.save(notification);

        mockMvc.perform(delete("/api/notifications/" + notification.getId())
                        .header("Role", "admin"))
                .andExpect(status().isOk());

        assertTrue(notificationRepository.findById(notification.getId()).isEmpty());
    }
}