package com.photo_contest.services;

import java.util.Collections;
import java.util.List;

import com.photo_contest.config.AuthContextManager;
import com.photo_contest.models.PhotoSubmission;
import com.photo_contest.models.DTO.PhotoSubmissionDTO;
import com.photo_contest.repos.ContestRepository;
import com.photo_contest.repos.PhotoSubmissionRepository;
import com.photo_contest.services.contracts.PhotoSubmissionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PhotoSubmissionServiceImpl implements PhotoSubmissionService {

    private final PhotoSubmissionRepository photoSubmissionRepository;
    private final AuthContextManager authContextManager;
    private final ContestRepository contestRepository;

    @Autowired
    public PhotoSubmissionServiceImpl(PhotoSubmissionRepository photoSubmissionRepository, AuthContextManager authContextManager, ContestRepository contestRepository) {
        this.photoSubmissionRepository = photoSubmissionRepository;
        this.authContextManager = authContextManager;
        this.contestRepository = contestRepository;
    }

    @Override
    public PhotoSubmission createPhotoSubmission(PhotoSubmissionDTO photoSubmissionDTO) {
        PhotoSubmission photoSubmission = new PhotoSubmission();
        photoSubmission.setTitle(photoSubmissionDTO.getTitle());
        photoSubmission.setStory(photoSubmissionDTO.getStory());
        photoSubmission.setPhotoUrl(photoSubmissionDTO.getPhotoUrl());
        photoSubmission.setCreator(authContextManager.getLoggedInUser()); 
        photoSubmission.setContest(contestRepository.findById(photoSubmissionDTO.getContestId()).get());
        photoSubmission.setPhotoReviews(Collections.emptyList());  
        
        return photoSubmissionRepository.save(photoSubmission);
    }

    @Override
    public PhotoSubmission getPhotoSubmissionById(Long id) {
        return photoSubmissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("PhotoSubmission not found"));
    }

    @Override
    public List<PhotoSubmission> getAllPhotoSubmissions() {
        return photoSubmissionRepository.findAll();
    }

    @Override
    public PhotoSubmission updatePhotoSubmission(Long id, PhotoSubmissionDTO photoSubmissionDTO) {
        PhotoSubmission photoSubmission = getPhotoSubmissionById(id);
        photoSubmission.setTitle(photoSubmissionDTO.getTitle());
        photoSubmission.setStory(photoSubmissionDTO.getStory());
        photoSubmission.setPhotoUrl(photoSubmissionDTO.getPhotoUrl());
        
        return photoSubmissionRepository.save(photoSubmission);
    }

    @Override
    public void deletePhotoSubmission(Long id) {
        if (!photoSubmissionRepository.existsById(id)) {
            throw new RuntimeException("PhotoSubmission not found");
        }
        photoSubmissionRepository.deleteById(id);
    }
}
