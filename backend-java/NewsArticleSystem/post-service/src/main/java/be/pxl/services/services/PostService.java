package be.pxl.services.services;

import be.pxl.services.controller.dto.ConceptDTO;
import be.pxl.services.controller.dto.PostDTO;
import be.pxl.services.controller.request.PostRequest;
import be.pxl.services.controller.request.PostUpdateRequest;
import be.pxl.services.domain.Post;
import be.pxl.services.repository.PostRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostService {

    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }


    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }

    public void approvePost(Long id) {
        Post post = postRepository.findById(id).orElseThrow();
        post.setApproved(true);
        postRepository.save(post);
    }


    public void updatePost(PostUpdateRequest postUpdateRequest) {
        Post post = postRepository.findById(postUpdateRequest.getId()).orElseThrow();
        post.setTitle(postUpdateRequest.getTitle());
        post.setContent(postUpdateRequest.getContent());
        postRepository.save(post);
    }

    public List<PostDTO> getFinishedPosts() {
        return postRepository.findByIsConceptIs(false).stream()
                .map(post -> PostDTO.builder()
                        .id(post.getId())
                        .title(post.getTitle())
                        .content(post.getContent())
                        .author(post.getAuthor())
                        .creationDate(post.getCreationDate().toString())
                        .build())
                .toList();
    }

    public List<ConceptDTO> getConceptPosts() {
        return postRepository.findByIsConceptIs(true).stream()
                .map(post -> ConceptDTO.builder()
                        .id(post.getId())
                        .title(post.getTitle())
                        .content(post.getContent())
                        .author(post.getAuthor())
                        .build())
                .toList();
    }


    public void addPost(PostRequest postRequest) {
        Post postToSave = Post.builder()
                .title(postRequest.getTitle())
                .content(postRequest.getContent())
                .author(postRequest.getAuthor())
                .creationDate(java.time.LocalDateTime.now())
                .isConcept(postRequest.isConcept())
                .isApproved(false)
                .build();

        System.out.println("Post to save: " + postToSave.getTitle() + postToSave.getContent() + postToSave.getAuthor());
        postRepository.save(postToSave);
    }
}
