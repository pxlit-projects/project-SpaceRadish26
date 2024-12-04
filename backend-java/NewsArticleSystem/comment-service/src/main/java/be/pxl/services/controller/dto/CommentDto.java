package be.pxl.services.controller.dto;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentDto {
    private String id;
    private String content;
    private String author;
    private String postId;

}