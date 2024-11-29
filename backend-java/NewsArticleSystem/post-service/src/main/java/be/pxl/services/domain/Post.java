package be.pxl.services.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class Post {

    @Id
    private UUID id;

    private String title;

    private String content;

    private String author;

    private LocalDateTime creationDate;

    private boolean concept;

    private boolean approved = false;

    private String rejectedReason = "";

}
