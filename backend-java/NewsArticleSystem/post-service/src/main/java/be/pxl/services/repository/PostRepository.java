package be.pxl.services.repository;

import be.pxl.services.domain.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PostRepository extends JpaRepository<Post, UUID> {


    List<Post> findByConceptIs(boolean isConcept);

    List<Post> findByAuthorAndConcept(String author, boolean concept);

    List<Post> findByApproved(boolean approved);
}
