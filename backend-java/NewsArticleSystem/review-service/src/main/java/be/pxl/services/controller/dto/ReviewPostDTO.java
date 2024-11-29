// review-service/src/main/java/be/pxl/services/controller/dto/ReviewPostDTO.java
package be.pxl.services.controller.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewPostDTO {
    private String id;
    private String title;
    private String content;
    private String author;
    private String creationDate;
    private boolean approved;
    private String rejectedReason;
}