package be.pxl.services.controller.dto;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationDTO {
    private String content;
    private String postId;
    private String notificationId;
}
