package be.pxl.services.controller.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PostUpdateRequest {

    private String title;
    private String content;
    private String id;
    private boolean concept;
}
