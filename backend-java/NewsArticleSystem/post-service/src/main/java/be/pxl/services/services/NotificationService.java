package be.pxl.services.services;

import be.pxl.services.controller.dto.NotificationDTO;
import be.pxl.services.controller.request.NotificationRequest2;
import be.pxl.services.domain.Notification;
import be.pxl.services.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final PostService postService;


    public NotificationService(NotificationRepository notificationRepository, PostService postService) {
        this.notificationRepository = notificationRepository;
        this.postService = postService;
    }


    public void deleteNotification(String notificationId) {
        notificationRepository.deleteById(Long.parseLong(notificationId));
    }

    public List<NotificationDTO> getNotifications(String user) {
       return notificationRepository.findAll().stream().filter(notification -> notification.getUserId().equals(user)).map(notification -> NotificationDTO.builder()
               .content(notification.getContent())
               .postId(notification.getPostId())
               .notificationId(notification.getId().toString())
               .build()).toList();

    }

    public void createNotification(NotificationRequest2 notificationRequest2) {
        Notification notification = Notification.builder()
                .content(notificationRequest2.getContent())
                .userId(postService.getPostAuthor(UUID.fromString(notificationRequest2.getPostId())))
                .postId(notificationRequest2.getPostId())
                .build();
        notificationRepository.save(notification);
    }
}
