package com.photo_contest.services;

import com.photo_contest.models.Contest;
import com.photo_contest.models.Phase;
import com.photo_contest.repos.PhaseRepository;
import com.photo_contest.utils.ContestUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.Executor;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class PhaseServiceImplTest {

    @Mock
    private PhaseRepository phaseRepository;

    @Mock
    private ContestUtils contestUtils;

    @InjectMocks
    private PhaseServiceImpl phaseService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreatePhaseOne_Success() {
        Contest contest = new Contest();
        contest.setStartDate(LocalDateTime.now());

        Phase phase = new Phase();
        when(phaseRepository.save(any(Phase.class))).thenReturn(phase);

        Phase result = phaseService.createPhaseOne(contest, 7);

        assertNotNull(result);
        verify(phaseRepository, times(1)).save(any(Phase.class));
    }

    @Test
    void testCreatePhaseTwo_Success() {
        Contest contest = new Contest();

        Phase phase = new Phase();
        when(phaseRepository.save(any(Phase.class))).thenReturn(phase);

        Phase result = phaseService.createPhaseTwo(contest, LocalDateTime.now(), 24);

        assertNotNull(result);
        verify(phaseRepository, times(1)).save(any(Phase.class));
    }

    @Test
    void testGetAllPhases_Success() {
        List<Phase> phases = List.of(new Phase(), new Phase());
        when(phaseRepository.findAll()).thenReturn(phases);

        List<Phase> result = phaseService.getAllPhases();

        assertEquals(2, result.size());
        verify(phaseRepository, times(1)).findAll();
    }

    @Test
    void testGetPhaseById_Success() {
        Phase phase = new Phase();
        when(phaseRepository.findById(anyLong())).thenReturn(Optional.of(phase));

        Optional<Phase> result = phaseService.getPhaseById(1L);

        assertTrue(result.isPresent());
        verify(phaseRepository, times(1)).findById(anyLong());
    }

    @Test
    void testProgressPhaseOne_Success() {
        Phase phase = new Phase();
        phase.setType(Phase.PhaseType.PHASE_ONE);
        phase.setEndDateTime(LocalDateTime.now().minusDays(1));
        phase.setConcluded(false);

        List<Phase> activePhases = List.of(phase);
        when(phaseRepository.findByType(Phase.PhaseType.PHASE_ONE)).thenReturn(activePhases);

        phaseService.progressPhaseOne();

        verify(phaseRepository, times(1)).save(any(Phase.class));
        assertTrue(phase.isConcluded());
    }

    @Test
    void testProgressPhaseTwo_Success() {
        Phase phase = new Phase();
        phase.setType(Phase.PhaseType.PHASE_TWO);
        phase.setEndDateTime(LocalDateTime.now().minusHours(2));
        phase.setConcluded(false);
        Contest contest = new Contest();
        contest.setId(1L);
        phase.setContest(contest);

        List<Phase> activePhases = List.of(phase);
        when(phaseRepository.findByType(Phase.PhaseType.PHASE_TWO)).thenReturn(activePhases);

        phaseService.progressPhaseTwo();

        verify(phaseRepository, times(1)).save(any(Phase.class));
        verify(contestUtils, times(1)).awardPointsForContest(1L);
        assertTrue(phase.isConcluded());
    }

    @Test
    void testCheckAndProgressPhaseOneDaily_Success() {

        List<Phase> mockPhases = new ArrayList<>();
        Phase mockPhase = new Phase();
        mockPhase.setEndDateTime(LocalDateTime.now().minusDays(1));
        mockPhase.setConcluded(false);
        mockPhases.add(mockPhase);

        when(phaseRepository.findByType(Phase.PhaseType.PHASE_ONE)).thenReturn(mockPhases);


        phaseService.checkAndProgressPhaseOneDaily();
        verify(phaseRepository, times(1)).findByType(Phase.PhaseType.PHASE_ONE);
        assertTrue(mockPhase.isConcluded());
        verify(phaseRepository, times(1)).save(mockPhase);
    }


    @Test
    void testCheckAndConcludePhaseTwoHourly_Success() {

        Contest mockContest = new Contest();
        mockContest.setId(1L);


        Phase mockPhase = new Phase();
        mockPhase.setEndDateTime(LocalDateTime.now().minusHours(1));
        mockPhase.setConcluded(false);
        mockPhase.setContest(mockContest);

        List<Phase> mockPhases = new ArrayList<>();
        mockPhases.add(mockPhase);


        when(phaseRepository.findByType(Phase.PhaseType.PHASE_TWO)).thenReturn(mockPhases);
        phaseService.checkAndConcludePhaseTwoHourly();
        verify(phaseRepository, times(1)).findByType(Phase.PhaseType.PHASE_TWO);
        assertTrue(mockPhase.isConcluded());
        verify(phaseRepository, times(1)).save(mockPhase);
    }



    @Test
    void testTaskExecutor() {
        Executor executor = phaseService.taskExecutor();
        assertTrue(executor instanceof ThreadPoolTaskExecutor);

        ThreadPoolTaskExecutor taskExecutor = (ThreadPoolTaskExecutor) executor;
        assertEquals(PhaseServiceImpl.CORE_POOL_SIZE, taskExecutor.getCorePoolSize());
        assertEquals(PhaseServiceImpl.MAX_POOL_SIZE, taskExecutor.getMaxPoolSize());
        assertEquals(PhaseServiceImpl.QUEUE_CAPACITY, taskExecutor.getQueueCapacity());
    }
}
