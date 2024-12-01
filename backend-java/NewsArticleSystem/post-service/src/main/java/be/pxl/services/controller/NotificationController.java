package be.pxl.services.controller;


import be.pxl.services.controller.dto.NotificationDTO;
import be.pxl.services.controller.request.NotificationRequest2;
import be.pxl.services.services.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final List<String> allowedRoles = List.of("admin", "writer", "guest", "reader");
    private final List<String> notificationRoles = List.of("admin", "writer");

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }
    @PostMapping
    public void createNotification(@RequestBody NotificationRequest2 notificationRequest2) {
        notificationService.createNotification(notificationRequest2);
    }

    @GetMapping
    public List<NotificationDTO> getNotifications(@RequestHeader("Role") String role, @RequestHeader("Username") String user) {
        return notificationService.getNotifications(user);
    }

    @DeleteMapping("/{notificationId}")
    public ResponseEntity<?> deleteNotification(@PathVariable String notificationId, @RequestHeader("Role") String role) {
        if (notificationRoles.contains(role)) {
            notificationService.deleteNotification(notificationId);
        }
        return ResponseEntity.ok().build();
    }

}
