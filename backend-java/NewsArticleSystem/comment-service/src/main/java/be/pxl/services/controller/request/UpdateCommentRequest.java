package be.pxl.services.controller.request;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateCommentRequest {
    private String id;
    private String content;
}
