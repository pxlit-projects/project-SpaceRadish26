package be.pxl.services.services;


import be.pxl.services.controller.dto.PostDTO;
import be.pxl.services.controller.dto.ReviewPostDTO;
import be.pxl.services.controller.request.PostRequest;
import be.pxl.services.controller.request.PostUpdateRequest;
import be.pxl.services.domain.Post;
import be.pxl.services.exception.ConceptException;
import be.pxl.services.repository.PostRepository;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final RabbitTemplate rabbitTemplate;
    private static final org.slf4j.Logger LOGGER = LoggerFactory.getLogger(PostService.class.getName());


    public PostService(PostRepository postRepository, RabbitTemplate rabbitTemplate) {
        this.postRepository = postRepository;
        this.rabbitTemplate = rabbitTemplate;
    }





    public void deletePost(UUID id) {
        postRepository.deleteById(id);
    }

    public void sendForApproval(UUID id) {
        Post post = postRepository.findById(id).orElseThrow();
        if (post.isConcept()) {
            throw new ConceptException("Post is a concept and cannot be sent for approval");
        }
        else
        {
            ReviewPostDTO postToSend = ReviewPostDTO.builder()
                    .id(post.getId())
                    .title(post.getTitle())
                    .content(post.getContent())
                    .author(post.getAuthor())
                    .creationDate(post.getCreationDate().toString())
                    .rejectedReason("")
                    .approved(false)
                    .build();
            rabbitTemplate.convertAndSend("myQueue", postToSend);

            LOGGER.info("Post sent for approval: {} {} {}", postToSend.getTitle(), postToSend.getContent(), postToSend.getAuthor());
        }
    }

    @RabbitListener(queues = "myQueue")
    public void getReviewedPost(ReviewPostDTO reviewPostDTO) {
        Post post = postRepository.findById(reviewPostDTO.getId()).orElseThrow();
        post.setApproved(reviewPostDTO.isApproved());
        post.setRejectedReason(reviewPostDTO.getRejectedReason());
        postRepository.save(post);
        LOGGER.info("Post received from review service: {} {} {}", reviewPostDTO.getTitle(), reviewPostDTO.getContent(), reviewPostDTO.getAuthor());
    }

    @Transactional
    public void updatePost(PostUpdateRequest postUpdateRequest) {
        Post post = postRepository.findById(UUID.fromString(postUpdateRequest.getId())).orElseThrow();
        post.setTitle(postUpdateRequest.getTitle());
        post.setContent(postUpdateRequest.getContent());
        post.setConcept(postUpdateRequest.isConcept());
        postRepository.save(post);
        if (!postUpdateRequest.isConcept()) {
            sendForApproval(post.getId());
        }
        LOGGER.info("Post updated: {} {} {}", post.getTitle(), post.getContent(), post.getAuthor());
    }

    public List<PostDTO> getFinishedPosts(String username) {
        return postRepository.findByAuthorAndConcept(username, false).stream().filter(post -> !post.isApproved() && (post.getRejectedReason() == null || Objects.equals(post.getRejectedReason(), "")))
                .map(post -> PostDTO.builder()
                        .id(String.valueOf(post.getId()))
                        .title(post.getTitle())
                        .content(post.getContent())
                        .author(post.getAuthor())
                        .creationDate(post.getCreationDate().toString())
                        .concept(post.isConcept())
                        .build())
                .toList();
    }

    public List<PostDTO> getConceptPosts(String username) {
        LOGGER.info("Fetching concept posts for {}", username);
        return postRepository.findByAuthorAndConcept(username, true).stream()
                .map(post -> PostDTO.builder()
                        .id(String.valueOf(post.getId()))
                        .title(post.getTitle())
                        .content(post.getContent())
                        .author(post.getAuthor())
                        .concept(true)
                        .approved(false)
                        .build())
                .toList();
    }


    @Transactional
    public void addPost(PostRequest postRequest) {
        LOGGER.info("Post request: {} {} {} {}", postRequest.getTitle(), postRequest.getContent(), postRequest.getAuthor(), postRequest.isConcept());
        Post postToSave = Post.builder()
                .id(UUID.randomUUID())
                .title(postRequest.getTitle())
                .content(postRequest.getContent())
                .author(postRequest.getAuthor())
                .creationDate(java.time.LocalDateTime.now())
                .concept(postRequest.isConcept())
                .approved(false)
                .rejectedReason("")
                .build();
        postRepository.save(postToSave);
        if (!postRequest.isConcept()) {
            sendForApproval(postToSave.getId());
        }
       LOGGER.info("Post saved: {} {} {}", postToSave.getTitle(), postToSave.getContent(), postToSave.getAuthor());

    }

    public PostDTO getPost(UUID id) {
        Post post = postRepository.findById(id).orElseThrow();
        return PostDTO.builder()
                .id(String.valueOf(id))
                .title(post.getTitle())
                .content(post.getContent())
                .author(post.getAuthor())
                .creationDate(post.getCreationDate().toString())
                .concept(post.isConcept())
                .rejectedReason(post.getRejectedReason())
                .build();
    }

    public List<PostDTO> getApprovedPosts() {
        return postRepository.findByApproved(true).stream()
                .map(post -> PostDTO.builder()
                        .id(String.valueOf(post.getId()))
                        .title(post.getTitle())
                        .content(post.getContent())
                        .author(post.getAuthor())
                        .creationDate(post.getCreationDate().toString())
                        .concept(false)
                        .approved(post.isApproved())
                        .build())
                .toList();
    }

    public List<ReviewPostDTO> getApprovedRejectedPosts(String username) {


        List<Post> posts = postRepository.findByAuthorAndConcept(username, false);


        List<ReviewPostDTO> result = posts.stream().filter(post -> post.isApproved() || ((post.getRejectedReason() != null && !Objects.equals(post.getRejectedReason(), ""))))
                .map(post -> ReviewPostDTO.builder()
                        .id(post.getId())
                        .title(post.getTitle())
                        .content(post.getContent())
                        .author(post.getAuthor())
                        .creationDate(post.getCreationDate().toString())
                        .approved(post.isApproved())
                        .rejectedReason(post.getRejectedReason())
                        .build())
                .collect(Collectors.toList());

        LOGGER.info("Approved and rejected posts fetched for {}", username);
        return result;
    }


    public String getPostAuthor(UUID id) {
        Post post = postRepository.findById(id).orElseThrow();
        return post.getAuthor();
    }
}
