package com.photo_contest.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.photo_contest.models.Role;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

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

    private Contest mockContest;
    private UserProfile mockOrganizer;
    private CreateContestDTO createContestDTO;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        mockOrganizer = new UserProfile();
        mockOrganizer.setId(1L);

        mockContest = new Contest();
        mockContest.setId(1L);
        mockContest.setTitle("Test Contest");
        mockContest.setOrganizer(mockOrganizer);

        createContestDTO = new CreateContestDTO();
        createContestDTO.setTitle("New Contest");
        createContestDTO.setCategory(Contest.Category.valueOf("LANDSCAPE"));
        createContestDTO.setPhaseDurationInDays(5);
        createContestDTO.setPhaseTwoDurationInHours(48);

        when(authContextManager.getLoggedInUser()).thenReturn(mockOrganizer);
    }

    @Test
    void testCreateContest_Success() {

        CreateContestDTO createContestDTO = new CreateContestDTO();
        createContestDTO.setTitle("New Contest");
        createContestDTO.setPhaseDurationInDays(5);
        createContestDTO.setPhaseTwoDurationInHours(48);

        UserProfile mockOrganizer = new UserProfile();
        mockOrganizer.setId(1L);
        mockOrganizer.setFirstName("Organizer Name");

        Contest mockContest = new Contest();
        mockContest.setId(1L);
        mockContest.setTitle("New Contest");
        mockContest.setOrganizer(mockOrganizer);

        Phase mockPhaseOne = new Phase();
        mockPhaseOne.setId(1L);
        mockPhaseOne.setType(Phase.PhaseType.PHASE_ONE);

        Phase mockPhaseTwo = new Phase();
        mockPhaseTwo.setId(2L);
        mockPhaseTwo.setType(Phase.PhaseType.PHASE_TWO);

        when(authContextManager.getLoggedInUser()).thenReturn(mockOrganizer);
        when(contestRepository.findByTitle(any())).thenReturn(Optional.empty());
        when(contestRepository.save(any(Contest.class))).thenReturn(mockContest);
        when(phaseService.createPhaseOne(any(Contest.class), anyInt())).thenReturn(mockPhaseOne);
        when(phaseService.createPhaseTwo(any(Contest.class), any(LocalDateTime.class), anyInt())).thenReturn(mockPhaseTwo);


        Contest result = contestServiceImpl.createContest(createContestDTO);


        assertNotNull(result);
        assertEquals("New Contest", result.getTitle());
        verify(contestRepository, times(2)).save(any(Contest.class));  // Two saves: before and after setting phases
        verify(phaseService, times(1)).createPhaseOne(any(Contest.class), anyInt());
        verify(phaseService, times(1)).createPhaseTwo(any(Contest.class), any(LocalDateTime.class), anyInt());
    }


    @Test
    void testCreateContest_ContestExists() {
        when(contestRepository.findByTitle(any())).thenReturn(Optional.of(mockContest));

        assertThrows(EntityExistsException.class, () -> contestServiceImpl.createContest(createContestDTO));
    }

    @Test
    void testDeleteContest_Success() {
        when(contestRepository.existsById(anyLong())).thenReturn(true);

        contestServiceImpl.deleteContest(1L);

        verify(contestRepository, times(1)).deleteById(anyLong());
    }

    @Test
    void testDeleteContest_NotFound() {
        when(contestRepository.existsById(anyLong())).thenReturn(false);

        assertThrows(EntityNotFoundException.class, () -> contestServiceImpl.deleteContest(1L));
    }

    @Test
    void testUpdateContest_Success() {
        when(contestRepository.findById(anyLong())).thenReturn(Optional.of(mockContest));
        when(contestRepository.save(any(Contest.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Contest updatedContest = contestServiceImpl.updateContest(1L, createContestDTO);

        assertNotNull(updatedContest);
        assertEquals("New Contest", updatedContest.getTitle());
        verify(contestRepository, times(1)).save(any(Contest.class));
    }

    @Test
    void testUpdateContest_NotFound() {
        when(contestRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> contestServiceImpl.updateContest(1L, createContestDTO));
    }

    @Test
    void testJoinContest_PublicContest_Success() {
        mockContest.setPrivate(false);
        when(contestRepository.findById(anyLong())).thenReturn(Optional.of(mockContest));
        when(userProfileRepository.save(any(UserProfile.class))).thenReturn(mockOrganizer);
        when(contestRepository.save(any(Contest.class))).thenReturn(mockContest);

        contestServiceImpl.joinContest(1L, 1L);

        verify(userProfileRepository, times(1)).save(mockOrganizer);
        verify(contestRepository, times(1)).save(mockContest);
    }

    @Test
    void testJoinContest_PrivateContest_Failure() {
        mockContest.setPrivate(true);
        when(contestRepository.findById(anyLong())).thenReturn(Optional.of(mockContest));

        assertThrows(AuthorizationException.class, () -> contestServiceImpl.joinContest(1L, 1L));
    }

    @Test
    void testInviteParticipants_Success() {
        List<Long> participantIds = List.of(2L, 3L);
        UserProfile userProfile1 = new UserProfile();
        userProfile1.setId(2L);

        when(contestRepository.findById(anyLong())).thenReturn(Optional.of(mockContest));
        when(userProfileRepository.findById(2L)).thenReturn(Optional.of(userProfile1));
        when(userProfileRepository.findById(3L)).thenReturn(Optional.of(mockOrganizer));

        List<Long> failedInvites = contestServiceImpl.inviteParticipants(1L, participantIds);

        assertEquals(0, failedInvites.size());
        verify(contestRepository, times(1)).save(mockContest);
    }

    @Test
    void testInviteJudges_Success() {

        List<Long> judgeIds = List.of(2L);
        UserProfile judgeProfile = new UserProfile();
        judgeProfile.setId(2L);

        Role mockRole = new Role();
        mockRole.setAuthority("MASTERUSER");

        mockContest.setJury(new ArrayList<>());

        when(contestRepository.findById(anyLong())).thenReturn(Optional.of(mockContest));
        when(userProfileRepository.findById(2L)).thenReturn(Optional.of(judgeProfile));
        when(roleRepository.findByAuthority("MASTERUSER")).thenReturn(Optional.of(mockRole));


        List<Long> failedInvites = contestServiceImpl.inviteJudges(1L, judgeIds);


        assertEquals(1, failedInvites.size());
        verify(contestRepository, times(1)).save(mockContest);
        verify(userProfileRepository, times(1)).findById(2L);
        verify(roleRepository, times(0)).findByAuthority("MASTERUSER");
    }


    @Test
    void testInviteJudges_Failure() {
        List<Long> judgeIds = List.of(2L);

        when(contestRepository.findById(anyLong())).thenReturn(Optional.of(mockContest));
        when(userProfileRepository.findById(anyLong())).thenReturn(Optional.of(mockOrganizer));

        List<Long> failedInvites = contestServiceImpl.inviteJudges(1L, judgeIds);

        assertEquals(1, failedInvites.size());
        verify(contestRepository, times(1)).save(mockContest);
    }

    @Test
    void testGetCurrentPhase_BeforeStart() {
        mockContest.setStartDate(LocalDateTime.now().plusDays(1));
        when(contestRepository.findById(anyLong())).thenReturn(Optional.of(mockContest));

        int phase = contestServiceImpl.getCurrentPhase(1L);

        assertEquals(0, phase);
    }

    @Test
    void testGetContestsByOrganizerId_Success() {
        when(contestRepository.findByOrganizerId(anyLong(), any(PageRequest.class)))
                .thenReturn(new PageImpl<>(List.of(mockContest)));

        Page<Contest> contests = contestServiceImpl.getContestsByOrganizerId(0, 10);

        assertNotNull(contests);
        assertEquals(1, contests.getTotalElements());
        verify(contestRepository, times(1)).findByOrganizerId(anyLong(), any(PageRequest.class));
    }
}
