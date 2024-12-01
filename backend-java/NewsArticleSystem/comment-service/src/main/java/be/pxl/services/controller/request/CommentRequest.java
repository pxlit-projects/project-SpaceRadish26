package be.pxl.services.controller.request;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CommentRequest {
    private String content;
    private String author;
    private String postId;

}
