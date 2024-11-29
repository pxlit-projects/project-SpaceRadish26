// review-service/src/main/java/be/pxl/services/repository/ReviewPostRepository.java
package be.pxl.services.repository;

import be.pxl.services.domain.ReviewPost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ReviewPostRepository extends JpaRepository<ReviewPost, UUID> {
}