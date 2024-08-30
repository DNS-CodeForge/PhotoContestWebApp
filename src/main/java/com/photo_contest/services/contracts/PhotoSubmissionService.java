package com.photo_contest.services.contracts;

import java.util.List;

import com.photo_contest.models.PhotoSubmission;
import com.photo_contest.models.DTO.PhotoSubmissionDTO;

public interface PhotoSubmissionService {
    PhotoSubmission createPhotoSubmission(PhotoSubmissionDTO photoSubmission);
    PhotoSubmission getPhotoSubmissionById(Long id);
    List<PhotoSubmission> getAllPhotoSubmissions();
    PhotoSubmission updatePhotoSubmission(Long id, PhotoSubmissionDTO photoSubmission);
    void deletePhotoSubmission(Long id);
}
