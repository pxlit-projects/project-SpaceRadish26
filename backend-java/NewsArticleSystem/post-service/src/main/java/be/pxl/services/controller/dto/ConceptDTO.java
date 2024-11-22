package be.pxl.services.controller.dto;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConceptDTO {

    private Long id;

    private String title;

    private String content;

    private String author;


}
