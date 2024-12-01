package be.pxl.services.feign;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NotificationRequest {
    private String content;
    private String sender;
    private String postId;
}
