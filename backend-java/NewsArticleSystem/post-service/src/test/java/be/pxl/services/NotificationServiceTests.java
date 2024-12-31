package be.pxl.services;

import be.pxl.services.controller.dto.NotificationDTO;
import be.pxl.services.controller.request.NotificationRequest2;
import be.pxl.services.domain.Notification;
import be.pxl.services.repository.NotificationRepository;
import be.pxl.services.services.NotificationService;
import be.pxl.services.services.PostService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

public class NotificationServiceTests {

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private PostService postService;

    @InjectMocks
    private NotificationService notificationService;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testDeleteNotification() {
        String notificationId = "1";
        notificationService.deleteNotification(notificationId);
        verify(notificationRepository, times(1)).deleteById(Long.parseLong(notificationId));
    }

    @Test
    public void testGetNotifications() {
        String user = "user1";
        Notification notification = new Notification();
        notification.setId(1L);
        notification.setUserId(user);
        notification.setContent("Content");
        notification.setPostId("postId");

        when(notificationRepository.findAll()).thenReturn(List.of(notification));

        List<NotificationDTO> notifications = notificationService.getNotifications(user);

        assertEquals(1, notifications.size());
        assertEquals(notification.getContent(), notifications.get(0).getContent());
    }

    @Test
    public void testCreateNotification() {
        String postId = UUID.randomUUID().toString();
        NotificationRequest2 notificationRequest2 = new NotificationRequest2();
        notificationRequest2.setContent("Content");
        notificationRequest2.setPostId(postId);

        when(postService.getPostAuthor(UUID.fromString(postId))).thenReturn("user1");

        notificationService.createNotification(notificationRequest2);

        ArgumentCaptor<Notification> captor = ArgumentCaptor.forClass(Notification.class);
        verify(notificationRepository, times(1)).save(captor.capture());
        Notification savedNotification = captor.getValue();
        assertEquals(notificationRequest2.getContent(), savedNotification.getContent());
        assertEquals(postId, savedNotification.getPostId());
    }
}