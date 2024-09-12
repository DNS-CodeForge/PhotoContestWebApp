package com.photo_contest.services.contracts;

import java.io.IOException;
import java.util.List;

import com.photo_contest.models.PhotoSubmission;
import com.photo_contest.models.DTO.PhotoSubmissionDTO;
import org.springframework.web.multipart.MultipartFile;

public interface PhotoSubmissionService {
    public PhotoSubmission createPhotoSubmission(Long contestId, PhotoSubmissionDTO photoSubmissionDTO, MultipartFile file) throws IOException;


    PhotoSubmission getPhotoSubmissionById(Long id);

    List<PhotoSubmission> getAllPhotoSubmissions();

    PhotoSubmission updatePhotoSubmission(Long id, PhotoSubmissionDTO photoSubmission, MultipartFile file) throws IOException;

    void deletePhotoSubmission(Long id);
}
