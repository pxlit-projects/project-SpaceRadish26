package be.pxl.services.controller.dto;


import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostDTO {

        private String id;

        private String title;

        private String content;

        private String author;

        private String creationDate;

        private boolean concept;

        private boolean approved;

        private String rejectedReason;

}
