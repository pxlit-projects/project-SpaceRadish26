package be.pxl.services.controller.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewPostDTO {

    @JsonProperty("id")
    private UUID id;

    @JsonProperty("title")
    private String title;

    @JsonProperty("content")
    private String content;

    @JsonProperty("author")
    private String author;

    @JsonProperty("creationDate")
    private String creationDate;

    @JsonProperty("approved")
    private boolean approved;

    @JsonProperty("rejectedReason")
    private String rejectedReason;
}