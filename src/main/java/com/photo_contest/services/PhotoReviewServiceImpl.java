package com.photo_contest.services;

import static com.photo_contest.constants.ModelValidationConstants.INVALID_ID;
import static com.photo_contest.constants.ModelValidationConstants.PH_TWO_REVIEW;
import static com.photo_contest.constants.ModelValidationConstants.USER_NOT_JURY;

import java.util.List;
import java.util.Optional;

import jakarta.persistence.EntityNotFoundException;

import com.photo_contest.config.AuthContextManager;
import com.photo_contest.exeptions.AuthorizationException;
import com.photo_contest.exeptions.ContestPhaseViolationException;
import com.photo_contest.models.Contest;
import com.photo_contest.models.PhotoReview;
import com.photo_contest.models.PhotoSubmission;
import com.photo_contest.models.UserProfile;
import com.photo_contest.models.DTO.PhotoReviewDTO;
import com.photo_contest.repos.PhotoReviewRepository;
import com.photo_contest.repos.PhotoSubmissionRepository;
import com.photo_contest.services.contracts.ContestService;
import com.photo_contest.services.contracts.PhotoReviewService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PhotoReviewServiceImpl implements PhotoReviewService{



    private final PhotoReviewRepository photoReviewRepository;
    private final PhotoSubmissionRepository photoSubmissionRepository;
    private final AuthContextManager authContextManager;
    private final ContestService contestService;

    @Autowired
    public PhotoReviewServiceImpl(PhotoReviewRepository photoReviewRepository, 
                                  PhotoSubmissionRepository photoSubmissionRepository,
                                  AuthContextManager authContextManager,
                                  ContestService contestService) {
        this.photoReviewRepository = photoReviewRepository;
        this.authContextManager = authContextManager;
        this.photoSubmissionRepository = photoSubmissionRepository;
        this.contestService = contestService;
    }

    @Override
    public PhotoReview createPhotoReview(PhotoReviewDTO photoReviewDTO, Long photoSubmissionId) {
        UserProfile jury = authContextManager.getLoggedInUser();
        PhotoSubmission photoSubmission = photoSubmissionRepository.findById(photoSubmissionId)
                .orElseThrow(() -> new EntityNotFoundException(INVALID_ID.formatted("Photo Submission", photoSubmissionId)));
        Contest contest = photoSubmission.getContest();

//        if (contestService.getCurrentPhase(contest.getId()) != 2) {
//            throw new ContestPhaseViolationException(PH_TWO_REVIEW);
//        }

        if(!contest.getJury().contains(jury)) {
            throw new AuthorizationException(USER_NOT_JURY);
        }

        Optional<PhotoReview> existingReview = photoReviewRepository.findByJuryAndPhotoSubmission(jury, photoSubmission);
        if (existingReview.isPresent()) {
            throw new EntityNotFoundException("Review by this jury for this submission already exists.");
        }
        PhotoReview photoReview = new PhotoReview();
        photoReview.setScore(photoReviewDTO.getScore());
        photoReview.setComment(photoReviewDTO.getComment());
        photoReview.setCategoryMismatch(photoReviewDTO.isCategoryMismatch());
        photoReview.setJury(jury);
        photoReview.setPhotoSubmission(photoSubmission);
        photoReview.setReviewed(false);

        return photoReviewRepository.save(photoReview);
    }

    @Override
    public Optional<PhotoReview> getPhotoReviewById(Long id) {
        return photoReviewRepository.findById(id);
    }

    @Override
    public List<PhotoReview> getAllPhotoReviews() {
        return photoReviewRepository.findAll();
    }

    @Override
    public PhotoReview updatePhotoReview(Long id, PhotoReviewDTO photoReviewDTO) {
        PhotoReview existingPhotoReview = photoReviewRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(INVALID_ID.formatted("Photo Review", id)));

        existingPhotoReview.setScore(photoReviewDTO.getScore());
        existingPhotoReview.setComment(photoReviewDTO.getComment());
        existingPhotoReview.setCategoryMismatch(photoReviewDTO.isCategoryMismatch());

        return photoReviewRepository.save(existingPhotoReview);
    }

    @Override
    public void deletePhotoReview(Long id) {
        if (photoReviewRepository.existsById(id)) {
            photoReviewRepository.deleteById(id);
        } else {
            throw new EntityNotFoundException(INVALID_ID.formatted("Photo Review", id));
        }
    }

    @Override
    public List<PhotoReview> getPhotoReviewsByPhotoSubmissionId(Long photoSubmissionId) {
        return photoReviewRepository.findByPhotoSubmissionId(photoSubmissionId);
    }

    @Override
    public List<PhotoReview> getPhotoReviewsByJuryId(Long juryId) {
        return photoReviewRepository.findByJuryId(juryId);
    }

    @Override
    public List<PhotoReview> getReviewsByUserId(Long userId) {
        return photoReviewRepository.findByPhotoSubmissionCreatorId(userId);
    }
}
