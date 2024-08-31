package com.photo_contest.services.contracts;

import java.util.List;
import java.util.Optional;

import com.photo_contest.models.PhotoReview;
import com.photo_contest.models.DTO.PhotoReviewDTO;

public interface PhotoReviewService {
    PhotoReview createPhotoReview(PhotoReviewDTO photoReviewDTO, Long photoSubmissionId);
    Optional<PhotoReview> getPhotoReviewById(Long id);
    List<PhotoReview> getAllPhotoReviews();
    PhotoReview updatePhotoReview(Long id, PhotoReviewDTO photoReviewDTO);
    void deletePhotoReview(Long id);
    List<PhotoReview> getPhotoReviewsByPhotoSubmissionId(Long photoSubmissionId);
    List<PhotoReview> getPhotoReviewsByJuryId(Long juryId);}
