package com.photo_contest.services;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

import com.photo_contest.config.AuthContextManager;
import com.photo_contest.exeptions.AuthorizationException;
import com.photo_contest.exeptions.ContestPhaseViolationException;
import com.photo_contest.exeptions.ImageUploadException;
import com.photo_contest.models.Contest;
import com.photo_contest.models.PhotoSubmission;
import com.photo_contest.models.DTO.PhotoSubmissionDTO;
import com.photo_contest.repos.ContestRepository;
import com.photo_contest.repos.PhotoSubmissionRepository;
import com.photo_contest.services.contracts.CloudinaryImageService;
import com.photo_contest.services.contracts.ContestService;
import com.photo_contest.services.contracts.PhotoSubmissionService;

import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import static com.photo_contest.constants.ModelValidationConstants.*;

@Service
public class PhotoSubmissionServiceImpl implements PhotoSubmissionService {


    private final PhotoSubmissionRepository photoSubmissionRepository;
    private final AuthContextManager authContextManager;
    private final ContestRepository contestRepository;
    private final ContestService contestService;
    private final CloudinaryImageService cloudinaryImageService;

    @Autowired
    public PhotoSubmissionServiceImpl(PhotoSubmissionRepository photoSubmissionRepository, AuthContextManager authContextManager, ContestRepository contestRepository,
                                      ContestService contestService, CloudinaryImageService cloudinaryImageService) {
        this.photoSubmissionRepository = photoSubmissionRepository;
        this.authContextManager = authContextManager;
        this.contestRepository = contestRepository;
        this.contestService = contestService;
        this.cloudinaryImageService = cloudinaryImageService;
    }
    @Override
    public PhotoSubmission createPhotoSubmission(Long contestId, PhotoSubmissionDTO photoSubmissionDTO, MultipartFile file) {
        Contest contest = contestRepository.findById(contestId)
                .orElseThrow(() -> new IllegalArgumentException("Contest not found"));

        if (!contestRepository.findAllContestsByUserProfileId(authContextManager.getId()).contains(contest) && contest.isPrivate()) {
            throw new AuthorizationException(INVALID_SUBMISSION);
        }

        if (contestService.getCurrentPhase(contestId) != 1) {
            throw new ContestPhaseViolationException(PH_ONE_SUBMISSION);
        }

        Long userId = authContextManager.getId();
        boolean submissionExists = photoSubmissionRepository.existsByContestIdAndCreatorId(contestId, userId);

        if (submissionExists) {
            throw new EntityExistsException("User has already submitted a photo for this contest.");
        }

        String uploadedPhotoUrl;
        try {
            uploadedPhotoUrl = cloudinaryImageService.uploadImage(file);
        } catch (IOException e) {
            throw new ImageUploadException(IMG_UPLOAD_FAIL + ".", e);
        }

        PhotoSubmission photoSubmission = new PhotoSubmission();
        photoSubmission.setTitle(photoSubmissionDTO.getTitle());
        photoSubmission.setStory(photoSubmissionDTO.getStory());
        photoSubmission.setPhotoUrl(uploadedPhotoUrl);
        photoSubmission.setCreator(authContextManager.getLoggedInUser());
        photoSubmission.setContest(contest);
        photoSubmission.setPhotoReviews(Collections.emptyList());



        contestService.joinContest(contestId, userId);

        return photoSubmissionRepository.save(photoSubmission);
    }

    @Override
    public List<PhotoSubmission> getSubmissionsByContestId(Long contestId) {
        Contest contest = contestRepository.findById(contestId)
                .orElseThrow(() -> new EntityNotFoundException(INVALID_ID.formatted("Contest", contestId)));
        return photoSubmissionRepository.findByContestId(contestId);
    }



    @Override
    public PhotoSubmission getPhotoSubmissionById(Long id) {
        return photoSubmissionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(INVALID_ID.formatted("Photo Submission", id)));
    }

    @Override
    public List<PhotoSubmission> getAllPhotoSubmissions() {
        return photoSubmissionRepository.findAll();
    }

    @Override
    public PhotoSubmission updatePhotoSubmission(Long id, PhotoSubmissionDTO photoSubmissionDTO, MultipartFile file) {
        PhotoSubmission photoSubmission = getPhotoSubmissionById(id);
        photoSubmission.setTitle(photoSubmissionDTO.getTitle());
        photoSubmission.setStory(photoSubmissionDTO.getStory());


        if (file != null && !file.isEmpty()) {
            try {
                String uploadedPhotoUrl = cloudinaryImageService.uploadImage(file);

                if (!uploadedPhotoUrl.equals(photoSubmission.getPhotoUrl())) {
                    photoSubmission.setPhotoUrl(uploadedPhotoUrl);
                }
            } catch (IOException e) {
                throw new ImageUploadException(IMG_UPLOAD_FAIL + ".", e);
            }
        }

        return photoSubmissionRepository.save(photoSubmission);
    }

    @Override
    public void deletePhotoSubmission(Long id) {
        if (!photoSubmissionRepository.existsById(id)) {
            throw new EntityNotFoundException(INVALID_ID.formatted("Photo Submission", id));
        }
        photoSubmissionRepository.deleteById(id);
    }
}
