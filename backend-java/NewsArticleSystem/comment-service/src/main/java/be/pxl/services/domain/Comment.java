package be.pxl.services.domain;


import jakarta.persistence.Id;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Comment {

    @Id
    private UUID id;

    private UUID postId;

    private String content;

    private String author;

}
