package be.pxl.services.controller.request;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationRequest2 {
    private String content;
    private String sender;
    private String postId;
}
