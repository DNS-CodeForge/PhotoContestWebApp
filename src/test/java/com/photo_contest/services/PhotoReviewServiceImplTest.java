package com.photo_contest.services;


import static com.photo_contest.constants.ModelValidationConstants.PH_TWO_REVIEW;
import static com.photo_contest.constants.ModelValidationConstants.USER_NOT_JURY;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Collections;
import java.util.Optional;

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

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

class PhotoReviewServiceImplTest {

    @Mock
    private PhotoReviewRepository photoReviewRepository;
    
    @Mock
    private PhotoSubmissionRepository photoSubmissionRepository;
    
    @Mock
    private AuthContextManager authContextManager;
    
    @Mock
    private ContestService contestService;
    
    @InjectMocks
    private PhotoReviewServiceImpl photoReviewService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreatePhotoReview_Success() {
        // Setup
        UserProfile juryUser = new UserProfile(); // This is the jury user
        PhotoSubmission photoSubmission = new PhotoSubmission();
        Contest contest = new Contest();
        contest.setJury(Collections.singletonList(juryUser)); // User is in the jury
        photoSubmission.setContest(contest);

        // Create a PhotoReviewDTO object
        PhotoReviewDTO photoReviewDTO = new PhotoReviewDTO();
        photoReviewDTO.setScore(5);
        photoReviewDTO.setComment("Great photo!");
        photoReviewDTO.setCategoryMismatch(false);

        // Mocking
        when(photoSubmissionRepository.findById(anyLong())).thenReturn(Optional.of(photoSubmission));
        when(authContextManager.getLoggedInUser()).thenReturn(juryUser); // The user is in the jury
        when(contestService.getCurrentPhase(anyLong())).thenReturn(2); // Ensure this is Phase Two

        // Creating the photo review
        System.out.println(contestService.getCurrentPhase(1L));
        PhotoReview createdPhotoReview = photoReviewService.createPhotoReview(photoReviewDTO, 1L);

        // Assertions
        assertNotNull(createdPhotoReview);
        assertEquals(5, createdPhotoReview.getScore());
        assertEquals("Great photo!", createdPhotoReview.getComment());
        assertFalse(createdPhotoReview.isCategoryMismatch());

        // Verify interactions
        verify(photoReviewRepository).save(any(PhotoReview.class));
    }

    @Test
    void testCreatePhotoReview_Fail_NotInJury() {
        // Setup
        UserProfile nonJuryUser = new UserProfile(); // This user is not in the jury
        PhotoSubmission photoSubmission = new PhotoSubmission();
        Contest contest = new Contest();
        contest.setJury(Collections.emptyList()); // No jury members
        photoSubmission.setContest(contest);

        // Create a PhotoReviewDTO object
        PhotoReviewDTO photoReviewDTO = new PhotoReviewDTO();
        photoReviewDTO.setScore(5);
        photoReviewDTO.setComment("Great photo!");
        photoReviewDTO.setCategoryMismatch(false);

        // Mocking
        when(photoSubmissionRepository.findById(anyLong())).thenReturn(Optional.of(photoSubmission));
        when(authContextManager.getLoggedInUser()).thenReturn(nonJuryUser); // The user is not in the jury
        when(contestService.getCurrentPhase(anyLong())).thenReturn(2); // Ensure this is Phase Two

        // Expecting AuthorizationException
        AuthorizationException thrown = assertThrows(
            AuthorizationException.class,
            () -> photoReviewService.createPhotoReview(photoReviewDTO, 1L),
            "Expected createPhotoReview() to throw AuthorizationException, but it didn't"
        );

        assertEquals(USER_NOT_JURY, thrown.getMessage());
    }

    @Test
    void testCreatePhotoReview_Fail_WrongPhase() {
        // Setup
        UserProfile juryUser = new UserProfile(); // This is the jury user
        PhotoSubmission photoSubmission = new PhotoSubmission();
        Contest contest = new Contest();
        contest.setJury(Collections.singletonList(juryUser)); // User is in the jury
        photoSubmission.setContest(contest);

        // Create a PhotoReviewDTO object
        PhotoReviewDTO photoReviewDTO = new PhotoReviewDTO();
        photoReviewDTO.setScore(5);
        photoReviewDTO.setComment("Great photo!");
        photoReviewDTO.setCategoryMismatch(false);

        // Mocking
        when(photoSubmissionRepository.findById(anyLong())).thenReturn(Optional.of(photoSubmission));
        when(authContextManager.getLoggedInUser()).thenReturn(juryUser); // The user is in the jury
        when(contestService.getCurrentPhase(anyLong())).thenReturn(1); // Wrong phase

        // Expecting ContestPhaseViolationException
        ContestPhaseViolationException thrown = assertThrows(
            ContestPhaseViolationException.class,
            () -> photoReviewService.createPhotoReview(photoReviewDTO, 1L),
            "Expected createPhotoReview() to throw ContestPhaseViolationException, but it didn't"
        );

        assertEquals(PH_TWO_REVIEW, thrown.getMessage());
    }
}

