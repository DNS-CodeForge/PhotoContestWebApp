package com.photo_contest.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.Optional;

import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;

import com.photo_contest.config.AuthContextManager;
import com.photo_contest.exeptions.AuthorizationException;
import com.photo_contest.models.Contest;
import com.photo_contest.models.Phase;
import com.photo_contest.models.UserProfile;
import com.photo_contest.models.DTO.CreateContestDTO;
import com.photo_contest.repos.ContestRepository;
import com.photo_contest.repos.PhotoSubmissionRepository;
import com.photo_contest.repos.RoleRepository;
import com.photo_contest.repos.UserProfileRepository;
import com.photo_contest.services.contracts.PhaseService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

class ContestServiceImplTest {

    @Mock
    private ContestRepository contestRepository;

    @Mock
    private PhotoSubmissionRepository photoSubmissionRepository;

    @Mock
    private AuthContextManager authContextManager;

    @Mock
    private PhaseService phaseService;

    @Mock
    private UserProfileRepository userProfileRepository;

    @Mock
    private RoleRepository roleRepository;

    @InjectMocks
    private ContestServiceImpl contestServiceImpl;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateContest_Success() {
        // Arrange
        CreateContestDTO createContestDTO = new CreateContestDTO();
        createContestDTO.setTitle("Test Contest");
        createContestDTO.setPhaseDurationInDays(5);
        createContestDTO.setPhaseTwoDurationInHours(48);

        when(contestRepository.findByTitle(anyString())).thenReturn(Optional.empty());
        when(contestRepository.save(any(Contest.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(phaseService.createPhaseOne(any(Contest.class), anyInt())).thenReturn(new Phase());
        when(phaseService.createPhaseTwo(any(Contest.class), any(LocalDateTime.class), anyInt())).thenReturn(new Phase());
        when(authContextManager.getLoggedInUser()).thenReturn(new UserProfile());

        // Act
        Contest result = contestServiceImpl.createContest(createContestDTO);

        // Assert
        assertNotNull(result);
        assertEquals("Test Contest", result.getTitle());
        verify(contestRepository, times(2)).save(any(Contest.class)); // Two saves: one before and one after phase creation
    }

    @Test
    void testCreateContest_ContestExists() {
        // Arrange
        CreateContestDTO createContestDTO = new CreateContestDTO();
        createContestDTO.setTitle("Existing Contest");

        when(contestRepository.findByTitle("Existing Contest")).thenReturn(Optional.of(new Contest()));

        // Act & Assert
        assertThrows(EntityExistsException.class, () -> contestServiceImpl.createContest(createContestDTO));
    }

    @Test
    void testDeleteContest() {
        // Arrange
        Long contestId = 1L;

        // Act
        contestServiceImpl.deleteContest(contestId);

        // Assert
        verify(contestRepository, times(1)).deleteById(contestId);
    }

    @Test
    void testUpdateContest_Success() {
        // Arrange
        Long contestId = 1L;
        Contest existingContest = new Contest();
        existingContest.setTitle("Old Title");

        CreateContestDTO updateContestDTO = new CreateContestDTO();
        updateContestDTO.setTitle("New Title");

        when(contestRepository.findById(contestId)).thenReturn(Optional.of(existingContest));
        when(contestRepository.save(any(Contest.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        Contest result = contestServiceImpl.updateContest(contestId, updateContestDTO);

        // Assert
        assertEquals("New Title", result.getTitle());
        verify(contestRepository, times(1)).save(existingContest);
    }

    @Test
    void testUpdateContest_ContestNotFound() {
        // Arrange
        Long contestId = 1L;
        CreateContestDTO updateContestDTO = new CreateContestDTO();

        when(contestRepository.findById(contestId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(EntityNotFoundException.class, () -> contestServiceImpl.updateContest(contestId, updateContestDTO));
    }

    @Test
    void testJoinContest_PublicContest_Success() {
        // Arrange
        Long contestId = 1L;
        Long userId = 1L;

        Contest contest = new Contest();
        contest.setPrivate(false);

        UserProfile userProfile = new UserProfile();
        userProfile.setId(userId);

        when(contestRepository.findById(contestId)).thenReturn(Optional.of(contest));
        when(authContextManager.getLoggedInUser()).thenReturn(userProfile);

        // Act
        contestServiceImpl.joinContest(contestId, userId);

        // Assert
        verify(userProfileRepository, times(1)).save(userProfile);
        verify(contestRepository, times(1)).save(contest);
    }

    @Test
    void testJoinContest_PrivateContest_Unauthorized() {
        // Arrange
        Long contestId = 1L;
        Long userId = 1L;

        Contest contest = new Contest();
        contest.setPrivate(true);

        UserProfile userProfile = new UserProfile();
        userProfile.setId(userId);

        when(contestRepository.findById(contestId)).thenReturn(Optional.of(contest));
        when(authContextManager.getLoggedInUser()).thenReturn(userProfile);

        // Act & Assert
        assertThrows(AuthorizationException.class, () -> contestServiceImpl.joinContest(contestId, userId));
    }

    @Test
    void testGetCurrentPhase_BeforeContestStart() {
        // Arrange
        Long contestId = 1L;

        Contest contest = new Contest();
        contest.setStartDate(LocalDateTime.now().plusDays(1));

        when(contestRepository.findById(contestId)).thenReturn(Optional.of(contest));

        // Act
        int phase = contestServiceImpl.getCurrentPhase(contestId);

        // Assert
        assertEquals(0, phase); // Before contest start, phase should be 0
    }
}
