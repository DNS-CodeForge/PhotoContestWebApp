package com.photo_contest.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import jakarta.persistence.EntityNotFoundException;

import com.photo_contest.config.AuthContextManager;
import com.photo_contest.exeptions.AuthorizationException;
import com.photo_contest.exeptions.ContestPhaseViolationException;
import com.photo_contest.exeptions.ImageUploadException;
import com.photo_contest.models.Contest;
import com.photo_contest.models.PhotoReview;
import com.photo_contest.models.PhotoSubmission;
import com.photo_contest.models.UserProfile;
import com.photo_contest.models.DTO.ContestPhotoDTO;
import com.photo_contest.models.DTO.PhotoSubmissionDTO;
import com.photo_contest.repos.ContestRepository;
import com.photo_contest.repos.PhotoSubmissionRepository;
import com.photo_contest.services.contracts.CloudinaryImageService;
import com.photo_contest.services.contracts.ContestService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.multipart.MultipartFile;

public class PhotoSubmissionServiceImplTest {

    @Mock
    private PhotoSubmissionRepository photoSubmissionRepository;

    @Mock
    private AuthContextManager authContextManager;

    @Mock
    private ContestRepository contestRepository;

    @Mock
    private ContestService contestService;

    @Mock
    private CloudinaryImageService cloudinaryImageService;

    @InjectMocks
    private PhotoSubmissionServiceImpl photoSubmissionService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // Test: createPhotoSubmission success
    @Test
    void testCreatePhotoSubmission_Success() throws IOException {
        Contest contest = new Contest();
        when(contestRepository.findById(anyLong())).thenReturn(Optional.of(contest));

        UserProfile user = new UserProfile();
        when(authContextManager.getLoggedInUser()).thenReturn(user);
        when(authContextManager.getId()).thenReturn(1L);

        when(contestService.getCurrentPhase(anyLong())).thenReturn(1);
        when(photoSubmissionRepository.existsByContestIdAndCreatorId(anyLong(), anyLong())).thenReturn(false);
        when(cloudinaryImageService.uploadImage(any(MultipartFile.class))).thenReturn("uploaded_url");

        PhotoSubmission photoSubmission = new PhotoSubmission();
        when(photoSubmissionRepository.save(any(PhotoSubmission.class))).thenReturn(photoSubmission);

        PhotoSubmissionDTO photoSubmissionDTO = new PhotoSubmissionDTO();
        photoSubmissionDTO.setTitle("Test Title");
        photoSubmissionDTO.setStory("Test Story");

        MultipartFile mockFile = mock(MultipartFile.class);

        PhotoSubmission createdSubmission = photoSubmissionService.createPhotoSubmission(1L, photoSubmissionDTO, mockFile);

        assertNotNull(createdSubmission);
        verify(photoSubmissionRepository, times(1)).save(any(PhotoSubmission.class));
        verify(contestService, times(1)).joinContest(1L, 1L);
    }

    // Test: ContestPhaseViolationException when the current phase is not 1
    @Test
    void testCreatePhotoSubmission_PhaseViolation() {
        Contest contest = new Contest();
        when(contestRepository.findById(anyLong())).thenReturn(Optional.of(contest));

        when(contestService.getCurrentPhase(anyLong())).thenReturn(2);

        PhotoSubmissionDTO photoSubmissionDTO = new PhotoSubmissionDTO();
        MultipartFile mockFile = mock(MultipartFile.class);

        assertThrows(ContestPhaseViolationException.class, () -> {
            photoSubmissionService.createPhotoSubmission(1L, photoSubmissionDTO, mockFile);
        });

        verify(photoSubmissionRepository, never()).save(any(PhotoSubmission.class));
    }

    // Test: AuthorizationException for private contest and unauthorized user
    @Test
    void testCreatePhotoSubmission_PrivateContest_Unauthorized() {
        Contest contest = new Contest();
        contest.setPrivate(true);
        when(contestRepository.findById(anyLong())).thenReturn(Optional.of(contest));

        when(contestRepository.findAllContestsByUserProfileId(anyLong())).thenReturn(Collections.emptyList());

        PhotoSubmissionDTO photoSubmissionDTO = new PhotoSubmissionDTO();
        MultipartFile mockFile = mock(MultipartFile.class);

        assertThrows(AuthorizationException.class, () -> {
            photoSubmissionService.createPhotoSubmission(1L, photoSubmissionDTO, mockFile);
        });

        verify(photoSubmissionRepository, never()).save(any(PhotoSubmission.class));
    }

    // Test: EntityExistsException when user has already submitted a photo
    @Test
    void testCreatePhotoSubmission_SubmissionAlreadyExists() {
        Contest contest = new Contest();
        when(contestRepository.findById(anyLong())).thenReturn(Optional.of(contest));

        when(authContextManager.getId()).thenReturn(1L);
        when(photoSubmissionRepository.existsByContestIdAndCreatorId(anyLong(), anyLong())).thenReturn(true);

        PhotoSubmissionDTO photoSubmissionDTO = new PhotoSubmissionDTO();
        MultipartFile mockFile = mock(MultipartFile.class);

        assertThrows(ContestPhaseViolationException.class, () -> {
            photoSubmissionService.createPhotoSubmission(1L, photoSubmissionDTO, mockFile);
        });

        verify(photoSubmissionRepository, never()).save(any(PhotoSubmission.class));
    }

    // Test: ImageUploadException on image upload failure
    @Test
    void testCreatePhotoSubmission_ImageUploadFailure() throws IOException {
        Contest contest = new Contest();
        when(contestRepository.findById(anyLong())).thenReturn(Optional.of(contest));

        when(contestService.getCurrentPhase(anyLong())).thenReturn(1);
        when(photoSubmissionRepository.existsByContestIdAndCreatorId(anyLong(), anyLong())).thenReturn(false);

        when(cloudinaryImageService.uploadImage(any(MultipartFile.class))).thenThrow(new IOException());

        PhotoSubmissionDTO photoSubmissionDTO = new PhotoSubmissionDTO();
        MultipartFile mockFile = mock(MultipartFile.class);

        assertThrows(ImageUploadException.class, () -> {
            photoSubmissionService.createPhotoSubmission(1L, photoSubmissionDTO, mockFile);
        });

        verify(photoSubmissionRepository, never()).save(any(PhotoSubmission.class));
    }

    // Test: getSubmissionsByContestId returns the submissions
    @Test
    void testGetSubmissionsByContestId_Success() {
        Contest contest = new Contest();
        when(contestRepository.findById(anyLong())).thenReturn(Optional.of(contest));

        PhotoSubmission submission = new PhotoSubmission();
        when(photoSubmissionRepository.findByContestId(anyLong())).thenReturn(Collections.singletonList(submission));

        var submissions = photoSubmissionService.getSubmissionsByContestId(1L);

        assertNotNull(submissions);
        assertEquals(1, submissions.size());
        verify(photoSubmissionRepository, times(1)).findByContestId(1L);
    }

    // Test: getSubmissionsByContestId throws EntityNotFoundException for non-existent contest
    @Test
    void testGetSubmissionsByContestId_ContestNotFound() {
        when(contestRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> {
            photoSubmissionService.getSubmissionsByContestId(1L);
        });

        verify(photoSubmissionRepository, never()).findByContestId(anyLong());
    }

    // Test: getPhotoSubmissionById returns the submission
    @Test
    void testGetPhotoSubmissionById_Success() {
        PhotoSubmission submission = new PhotoSubmission();
        when(photoSubmissionRepository.findById(anyLong())).thenReturn(Optional.of(submission));

        var result = photoSubmissionService.getPhotoSubmissionById(1L);

        assertNotNull(result);
        verify(photoSubmissionRepository, times(1)).findById(1L);
    }

    // Test: getPhotoSubmissionById throws EntityNotFoundException for non-existent submission
    @Test
    void testGetPhotoSubmissionById_NotFound() {
        when(photoSubmissionRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> {
            photoSubmissionService.getPhotoSubmissionById(1L);
        });

        verify(photoSubmissionRepository, times(1)).findById(1L);
    }

    // Test: deletePhotoSubmission success
    @Test
    void testDeletePhotoSubmission_Success() {
        when(photoSubmissionRepository.existsById(anyLong())).thenReturn(true);

        photoSubmissionService.deletePhotoSubmission(1L);

        verify(photoSubmissionRepository, times(1)).deleteById(1L);
    }

    // Test: deletePhotoSubmission throws EntityNotFoundException when submission not found
    @Test
    void testDeletePhotoSubmission_NotFound() {
        when(photoSubmissionRepository.existsById(anyLong())).thenReturn(false);

        assertThrows(EntityNotFoundException.class, () -> {
            photoSubmissionService.deletePhotoSubmission(1L);
        });

        verify(photoSubmissionRepository, never()).deleteById(anyLong());
    }

   
    @Test
    void testUpdatePhotoSubmission_Success() throws IOException {
        PhotoSubmission existingSubmission = new PhotoSubmission();
        existingSubmission.setPhotoUrl("old_url");

        // Stubbing the findById to return the existing photo submission
        when(photoSubmissionRepository.findById(anyLong())).thenReturn(Optional.of(existingSubmission));
        
        // Stubbing the image upload service to return a new URL
        when(cloudinaryImageService.uploadImage(any(MultipartFile.class))).thenReturn("new_uploaded_url");

        // Stubbing the save method to return the updated photo submission
        PhotoSubmission updatedSubmission = new PhotoSubmission();
        updatedSubmission.setTitle("Updated Title");
        updatedSubmission.setStory("Updated Story");
        updatedSubmission.setPhotoUrl("new_uploaded_url");
        when(photoSubmissionRepository.save(any(PhotoSubmission.class))).thenReturn(updatedSubmission);

        PhotoSubmissionDTO photoSubmissionDTO = new PhotoSubmissionDTO();
        photoSubmissionDTO.setTitle("Updated Title");
        photoSubmissionDTO.setStory("Updated Story");

        MultipartFile mockFile = mock(MultipartFile.class);

        // Calling the method under test
        PhotoSubmission result = photoSubmissionService.updatePhotoSubmission(1L, photoSubmissionDTO, mockFile);

        // Asserting that the result is not null and checking the updated values
        assertNotNull(result);
        assertEquals("Updated Title", result.getTitle());
        assertEquals("Updated Story", result.getStory());
        assertEquals("new_uploaded_url", result.getPhotoUrl());
    }


    @Test
    void testUpdatePhotoSubmission_NoFile() {
        // Arrange
        PhotoSubmission existingSubmission = new PhotoSubmission();
        existingSubmission.setPhotoUrl("existing_url");

        // Stub the repository to return the existing submission
        when(photoSubmissionRepository.findById(anyLong())).thenReturn(Optional.of(existingSubmission));

        // Stub the save method to return the updated submission
        PhotoSubmission updatedSubmission = new PhotoSubmission();
        updatedSubmission.setTitle("Updated Title");
        updatedSubmission.setStory("Updated Story");
        updatedSubmission.setPhotoUrl("existing_url");
        when(photoSubmissionRepository.save(any(PhotoSubmission.class))).thenReturn(updatedSubmission);

        // No file provided
        MultipartFile mockFile = null;

        PhotoSubmissionDTO photoSubmissionDTO = new PhotoSubmissionDTO();
        photoSubmissionDTO.setTitle("Updated Title");
        photoSubmissionDTO.setStory("Updated Story");

        // Act
        PhotoSubmission result = photoSubmissionService.updatePhotoSubmission(1L, photoSubmissionDTO, mockFile);

        // Assert
        assertNotNull(result);
        assertEquals("Updated Title", result.getTitle());
        assertEquals("Updated Story", result.getStory());
        assertEquals("existing_url", result.getPhotoUrl());
    }

    @Test
    void testUpdatePhotoSubmission_ImageUploadFailure() throws IOException {
        PhotoSubmission existingSubmission = new PhotoSubmission();
        existingSubmission.setPhotoUrl("existing_url");

        when(photoSubmissionRepository.findById(anyLong())).thenReturn(Optional.of(existingSubmission));
        when(cloudinaryImageService.uploadImage(any(MultipartFile.class))).thenThrow(new IOException());

        PhotoSubmissionDTO photoSubmissionDTO = new PhotoSubmissionDTO();
        MultipartFile mockFile = mock(MultipartFile.class);

        assertThrows(ImageUploadException.class, () -> {
            photoSubmissionService.updatePhotoSubmission(1L, photoSubmissionDTO, mockFile);
        });
    }

    @Test
    void testGetSubmissionsByUserId_Success() {
        PhotoSubmission submission = new PhotoSubmission();
        when(photoSubmissionRepository.findByCreatorId(anyLong())).thenReturn(Collections.singletonList(submission));

        var submissions = photoSubmissionService.getSubmissionsByUserId(1L);

        assertNotNull(submissions);
        assertEquals(1, submissions.size());
        verify(photoSubmissionRepository, times(1)).findByCreatorId(1L);
    }

    @Test
    void testGetSubmissionsByUserId_NoSubmissions() {
        when(photoSubmissionRepository.findByCreatorId(anyLong())).thenReturn(Collections.emptyList());

        var submissions = photoSubmissionService.getSubmissionsByUserId(1L);

        assertNotNull(submissions);
        assertTrue(submissions.isEmpty());
        verify(photoSubmissionRepository, times(1)).findByCreatorId(1L);
    }

    @Test
    void testGetSubmissionsByJuryMemberId_EmptySubmissions() {
        when(authContextManager.getId()).thenReturn(1L);
        when(photoSubmissionRepository.findSubmissionsByJuryMemberId(anyLong())).thenReturn(Collections.emptyList());

        List<ContestPhotoDTO> result = photoSubmissionService.getSubmissionsByJuryMemberId();

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

}
