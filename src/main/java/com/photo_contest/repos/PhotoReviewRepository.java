package com.photo_contest.repos;

import java.util.List;

import com.photo_contest.models.PhotoReview;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PhotoReviewRepository extends JpaRepository<PhotoReview, Long>{
    List<PhotoReview> findByPhotoSubmissionId(Long photoSubmissionId);
    List<PhotoReview> findByJuryId(Long juryId);
    List<PhotoReview> findByPhotoSubmissionCreatorId(Long userId);
}
