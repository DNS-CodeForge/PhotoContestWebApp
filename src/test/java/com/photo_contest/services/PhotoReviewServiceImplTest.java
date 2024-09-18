package com.photo_contest.services;

import static com.photo_contest.constants.ModelValidationConstants.INVALID_ID;
import static com.photo_contest.constants.ModelValidationConstants.PH_TWO_REVIEW;
import static com.photo_contest.constants.ModelValidationConstants.USER_NOT_JURY;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

import java.util.Collections;
import java.util.List;
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

import jakarta.persistence.EntityNotFoundException;
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

    private UserProfile juryUser;
    private PhotoSubmission photoSubmission;
    private Contest contest;
    private PhotoReviewDTO photoReviewDTO;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        juryUser = new UserProfile();
        photoSubmission = new PhotoSubmission();
        contest = new Contest();
        contest.setId(1L);
        contest.setJury(Collections.singletonList(juryUser));
        photoSubmission.setContest(contest);

        photoReviewDTO = new PhotoReviewDTO();
        photoReviewDTO.setScore(5);
        photoReviewDTO.setComment("Great photo!");
        photoReviewDTO.setCategoryMismatch(false);
    }

    @Test
    void testCreatePhotoReview_Success() {
        when(photoSubmissionRepository.findById(anyLong())).thenReturn(Optional.of(photoSubmission));
        when(authContextManager.getLoggedInUser()).thenReturn(juryUser);
        when(contestService.getCurrentPhase(1L)).thenReturn(2);

        PhotoReview photoReview = new PhotoReview();
        photoReview.setScore(photoReviewDTO.getScore());
        photoReview.setComment(photoReviewDTO.getComment());
        photoReview.setCategoryMismatch(photoReviewDTO.isCategoryMismatch());

        when(photoReviewRepository.save(any(PhotoReview.class))).thenReturn(photoReview);

        PhotoReview createdPhotoReview = photoReviewService.createPhotoReview(photoReviewDTO, 1L);

        assertNotNull(createdPhotoReview);
        assertEquals(5, createdPhotoReview.getScore());
        assertEquals("Great photo!", createdPhotoReview.getComment());
        assertFalse(createdPhotoReview.isCategoryMismatch());

        verify(photoReviewRepository).save(any(PhotoReview.class));
    }

    @Test
    void testCreatePhotoReview_Fail_NotInJury() {
        contest.setJury(Collections.emptyList());
        when(photoSubmissionRepository.findById(anyLong())).thenReturn(Optional.of(photoSubmission));
        when(authContextManager.getLoggedInUser()).thenReturn(new UserProfile());
        when(contestService.getCurrentPhase(anyLong())).thenReturn(2);

        AuthorizationException thrown = assertThrows(
                AuthorizationException.class,
                () -> photoReviewService.createPhotoReview(photoReviewDTO, 1L)
        );

        assertEquals(USER_NOT_JURY, thrown.getMessage());
    }

    @Test
    void testCreatePhotoReview_Fail_WrongPhase() {
        when(photoSubmissionRepository.findById(anyLong())).thenReturn(Optional.of(photoSubmission));
        when(authContextManager.getLoggedInUser()).thenReturn(juryUser);
        when(contestService.getCurrentPhase(anyLong())).thenReturn(1);

        ContestPhaseViolationException thrown = assertThrows(
                ContestPhaseViolationException.class,
                () -> photoReviewService.createPhotoReview(photoReviewDTO, 1L)
        );

        assertEquals(PH_TWO_REVIEW, thrown.getMessage());
    }

    @Test
    void testGetPhotoReviewById_Success() {
        PhotoReview photoReview = new PhotoReview();
        when(photoReviewRepository.findById(anyLong())).thenReturn(Optional.of(photoReview));

        Optional<PhotoReview> foundPhotoReview = photoReviewService.getPhotoReviewById(1L);

        assertTrue(foundPhotoReview.isPresent());
    }

    @Test
    void testGetPhotoReviewById_NotFound() {
        when(photoReviewRepository.findById(anyLong())).thenReturn(Optional.empty());

        Optional<PhotoReview> foundPhotoReview = photoReviewService.getPhotoReviewById(1L);

        assertFalse(foundPhotoReview.isPresent());
    }

    @Test
    void testGetAllPhotoReviews() {
        PhotoReview photoReview = new PhotoReview();
        when(photoReviewRepository.findAll()).thenReturn(List.of(photoReview));

        List<PhotoReview> photoReviews = photoReviewService.getAllPhotoReviews();

        assertNotNull(photoReviews);
        assertEquals(1, photoReviews.size());
    }

    @Test
    void testUpdatePhotoReview_Success() {
        PhotoReview existingPhotoReview = new PhotoReview();
        when(photoReviewRepository.findById(anyLong())).thenReturn(Optional.of(existingPhotoReview));

        photoReviewDTO.setScore(9);
        photoReviewDTO.setComment("Updated comment");
        when(photoReviewRepository.save(any(PhotoReview.class))).thenReturn(existingPhotoReview);

        PhotoReview updatedPhotoReview = photoReviewService.updatePhotoReview(1L, photoReviewDTO);

        assertNotNull(updatedPhotoReview);
        assertEquals(9, updatedPhotoReview.getScore());
        assertEquals("Updated comment", updatedPhotoReview.getComment());
    }

    @Test
    void testUpdatePhotoReview_NotFound() {
        when(photoReviewRepository.findById(anyLong())).thenReturn(Optional.empty());

        EntityNotFoundException thrown = assertThrows(
                EntityNotFoundException.class,
                () -> photoReviewService.updatePhotoReview(1L, photoReviewDTO)
        );

        assertEquals(INVALID_ID.formatted("Photo Review", 1L), thrown.getMessage());
    }

    @Test
    void testDeletePhotoReview_Success() {
        when(photoReviewRepository.existsById(anyLong())).thenReturn(true);

        photoReviewService.deletePhotoReview(1L);

        verify(photoReviewRepository).deleteById(1L);
    }

    @Test
    void testDeletePhotoReview_NotFound() {
        when(photoReviewRepository.existsById(anyLong())).thenReturn(false);

        EntityNotFoundException thrown = assertThrows(
                EntityNotFoundException.class,
                () -> photoReviewService.deletePhotoReview(1L)
        );

        assertEquals(INVALID_ID.formatted("Photo Review", 1L), thrown.getMessage());
    }

    @Test
    void testGetPhotoReviewsByPhotoSubmissionId() {
        PhotoReview photoReview = new PhotoReview();
        when(photoReviewRepository.findByPhotoSubmissionId(anyLong())).thenReturn(List.of(photoReview));

        List<PhotoReview> photoReviews = photoReviewService.getPhotoReviewsByPhotoSubmissionId(1L);

        assertNotNull(photoReviews);
        assertEquals(1, photoReviews.size());
    }

    @Test
    void testGetPhotoReviewsByJuryId() {
        PhotoReview photoReview = new PhotoReview();
        when(photoReviewRepository.findByJuryId(anyLong())).thenReturn(List.of(photoReview));

        List<PhotoReview> photoReviews = photoReviewService.getPhotoReviewsByJuryId(1L);

        assertNotNull(photoReviews);
        assertEquals(1, photoReviews.size());
    }

    @Test
    void testGetReviewsByUserId() {
        PhotoReview photoReview = new PhotoReview();
        when(photoReviewRepository.findByPhotoSubmissionCreatorId(anyLong())).thenReturn(List.of(photoReview));

        List<PhotoReview> photoReviews = photoReviewService.getReviewsByUserId(1L);

        assertNotNull(photoReviews);
        assertEquals(1, photoReviews.size());
    }
}
