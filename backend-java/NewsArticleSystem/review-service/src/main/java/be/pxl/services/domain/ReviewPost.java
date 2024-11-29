// review-service/src/main/java/be/pxl/services/domain/ReviewPost.java
package be.pxl.services.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewPost {
    @Id
    private UUID id;

    private String title;
    private String content;
    private String author;
    private String creationDate;
    private boolean approved;
    private String rejectedReason;
}