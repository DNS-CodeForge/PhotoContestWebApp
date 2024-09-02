package com.photo_contest.services;

import com.photo_contest.models.Contest;
import com.photo_contest.models.Phase;
import com.photo_contest.repos.PhaseRepository;
import com.photo_contest.services.contracts.PhaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;

@Service
public class PhaseServiceImpl implements PhaseService {



    public static final int DAILY_CHECK_HOUR = 15;
    private static final String DAILY_CHECK_CRON = "0 0 " + DAILY_CHECK_HOUR + " * * ?";


    public static final int HOURLY_CHECK_INTERVAL = 1;
    private static final String HOURLY_CHECK_CRON = "0 0 0/" + HOURLY_CHECK_INTERVAL + " * * ?";

    private static final int AVAILABLE_PROCESSORS = Runtime.getRuntime().availableProcessors();
    private static final int CORE_POOL_SIZE = AVAILABLE_PROCESSORS;
    private static final int MAX_POOL_SIZE = AVAILABLE_PROCESSORS * 2;
    private static final int QUEUE_CAPACITY = 500;
    private static final String THREAD_NAME_PREFIX = "PhaseCheck-";

    private final PhaseRepository phaseRepository;

    @Autowired
    public PhaseServiceImpl(PhaseRepository phaseRepository) {
        this.phaseRepository = phaseRepository;
    }

    @Override
    public Phase createPhase(Contest contest, int duration) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startDateTime = calculateStartDateTime(now);
        LocalDateTime endDateTime = startDateTime.plusDays(duration);

        Phase newPhase = new Phase();
        newPhase.setType(Phase.PhaseType.PHASE_ONE);
        newPhase.setStartDateTime(startDateTime);
        newPhase.setEndDateTime(endDateTime);
        newPhase.setContest(contest);
        newPhase.setConcluded(false);

        return phaseRepository.save(newPhase);
    }

    @Override
    public Phase createPhase(Contest contest, LocalDateTime startDateTime, int durationInHours) {
        LocalDateTime endDateTime = startDateTime.plusHours(durationInHours);

        Phase newPhase = new Phase();
        newPhase.setType(Phase.PhaseType.PHASE_TWO);
        newPhase.setStartDateTime(startDateTime);
        newPhase.setEndDateTime(endDateTime);
        newPhase.setContest(contest);
        newPhase.setConcluded(false);

        return phaseRepository.save(newPhase);
    }

    @Override
    public void deletePhase(Long phaseId) {
        Optional<Phase> phase = phaseRepository.findById(phaseId);
        if (phase.isPresent()) {
            phaseRepository.delete(phase.get());
        } else {
            throw new IllegalArgumentException("Phase with ID " + phaseId + " not found");
        }
    }

    @Override
    public List<Phase> getAllPhases() {
        return phaseRepository.findAll();
    }

    @Override
    public List<Phase> getAllPhases(String phaseType) {
        return phaseRepository.findByType(Phase.PhaseType.valueOf(phaseType));
    }

    @Override
    public Optional<Phase> getPhaseById(Long phaseId) {
        return phaseRepository.findById(phaseId);
    }

    @Override
    public void updatePhase(Long phaseId, Phase updatedPhase) {
        Optional<Phase> existingPhase = phaseRepository.findById(phaseId);
        if (existingPhase.isPresent()) {
            Phase phase = existingPhase.get();
            phase.setStartDateTime(updatedPhase.getStartDateTime());
            phase.setEndDateTime(updatedPhase.getEndDateTime());
            phase.setType(updatedPhase.getType());
            phase.setConcluded(updatedPhase.isConcluded());
            phaseRepository.save(phase);
        } else {
            throw new IllegalArgumentException("Phase with ID " + phaseId + " not found");
        }
    }

    @Override
    @Scheduled(cron = DAILY_CHECK_CRON)
    @Async("taskExecutor")
    public void checkAndProgressPhaseOneDaily() {
        CompletableFuture.runAsync(this::progressPhaseOne).join();
    }

    @Override
    @Scheduled(cron = HOURLY_CHECK_CRON)
    @Async("taskExecutor")
    public void checkAndConcludePhaseTwoHourly() {
        CompletableFuture.runAsync(this::progressPhaseTwo).join();
    }

    @Bean
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(CORE_POOL_SIZE);
        executor.setMaxPoolSize(MAX_POOL_SIZE);
        executor.setQueueCapacity(QUEUE_CAPACITY);
        executor.setThreadNamePrefix(THREAD_NAME_PREFIX);
        executor.initialize();
        return executor;
    }

    private LocalDateTime calculateStartDateTime(LocalDateTime now) {
        LocalTime phaseStartTime = LocalTime.of(18, 0);
        if (now.toLocalTime().isBefore(phaseStartTime)) {
            return now.with(phaseStartTime);
        } else {
            return now.plusDays(1).with(phaseStartTime);
        }
    }

    public void progressPhaseOne() {
        List<Phase> activePhases = phaseRepository.findByType(Phase.PhaseType.PHASE_ONE);
        LocalDateTime now = LocalDateTime.now();

        for (Phase phase : activePhases) {
            if (now.isAfter(phase.getEndDateTime()) && !phase.isConcluded()) {
                phase.setConcluded(true);
                phaseRepository.save(phase);
            }
        }
    }

    public void progressPhaseTwo() {
        List<Phase> activePhases = phaseRepository.findByType(Phase.PhaseType.PHASE_TWO);
        LocalDateTime now = LocalDateTime.now();

        for (Phase phase : activePhases) {
            if (now.isAfter(phase.getEndDateTime()) && !phase.isConcluded()) {
                phase.setConcluded(true);
                phaseRepository.save(phase);
            }
        }
    }
}
