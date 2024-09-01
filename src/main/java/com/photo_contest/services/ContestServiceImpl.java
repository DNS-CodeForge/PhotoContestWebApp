package com.photo_contest.services;

import com.photo_contest.config.AuthContextManager;
import com.photo_contest.models.Contest;
import com.photo_contest.models.DTO.CreateContestDTO;
import com.photo_contest.models.Phase;
import com.photo_contest.repos.ContestRepository;
import com.photo_contest.services.contracts.ContestService;
import com.photo_contest.services.contracts.PhaseService;
import jakarta.persistence.EntityExistsException;
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
public class ContestServiceImpl implements ContestService {
    public static final int START_DELAY_PERIOD = 2;
    public static final int PHASE_CHECK_HOUR = 18;
    private static final String PHASE_CHECK_CRON = "0 0 " + PHASE_CHECK_HOUR + " * * ?";
    private static final int AVAILABLE_PROCESSORS = Runtime.getRuntime().availableProcessors();
    private static final int CORE_POOL_SIZE = AVAILABLE_PROCESSORS;
    private static final int MAX_POOL_SIZE = AVAILABLE_PROCESSORS * 2;
    private static final int QUEUE_CAPACITY = 500;
    private static final String THREAD_NAME_PREFIX = "PhaseCheck-";

    private final ContestRepository contestRepository;
    private final AuthContextManager authContextManager;
    private final PhaseService phaseService;

    @Autowired
    public ContestServiceImpl(ContestRepository contestRepository, AuthContextManager authContextManager, PhaseService phaseService) {
        this.contestRepository = contestRepository;
        this.authContextManager = authContextManager;
        this.phaseService = phaseService;
    }

        @Override
        public Contest createContest(CreateContestDTO createContestDTO) {
            if (contestRepository.findByTitle(createContestDTO.getTitle()).isPresent()) {
                throw new EntityExistsException("Contest with this title already exists");
            }

            LocalDateTime startDateTime = calculateStartDate();
            LocalDateTime endDateTime = calculateEndDate(startDateTime, createContestDTO.getPhaseDurationInDays());

            Contest contest = new Contest();
            contest.setTitle(createContestDTO.getTitle());
            contest.setCategory(createContestDTO.getCategory());
            contest.setStartDate(startDateTime);
            contest.setEndDate(endDateTime);

            contest.setOrganizer(authContextManager.getLoggedInUser());


            Contest savedContest = contestRepository.save(contest);



            Phase initialPhase = phaseService.createPhase(savedContest, createContestDTO.getPhaseDurationInDays());


            savedContest.setPhases(List.of(initialPhase));
            return contestRepository.save(savedContest);
        }

        @Override
        public void deleteContest(Long contestId) {
            contestRepository.deleteById(contestId);
        }

        @Override
        public Contest updateContest(Long contestId, CreateContestDTO updateContestDTO) {
            Optional<Contest> contestOpt = contestRepository.findById(contestId);
            if (contestOpt.isPresent()) {
                Contest contest = contestOpt.get();
                contest.setTitle(updateContestDTO.getTitle());
                contest.setCategory(updateContestDTO.getCategory());

                return contestRepository.save(contest);
            } else {
                throw new IllegalArgumentException("Contest with ID " + contestId + " not found");
            }
        }

        @Override
        public List<Contest> getAllContest() {
            return contestRepository.findAll();
        }

        @Override
        public Optional<Contest> getContestById(Long contestId) {
            return contestRepository.findById(contestId);
        }

        @Override
        public Optional<Contest> getContestByTitle(String title) {
            return contestRepository.findByTitle(title);
        }

        @Override
        public Contest saveContest(Contest contest) {
            return contestRepository.save(contest);
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

//     #TODO: Implement the checkAndProgressPhasesHourly method
        @Override
        @Scheduled(cron = PHASE_CHECK_CRON)
        @Async("taskExecutor")
        public void checkAndProgressPhasesDaily() {
            CompletableFuture<Void> phaseTwoTask = CompletableFuture.runAsync(phaseService::progressPhaseTwo);

            CompletableFuture<Void> phaseOneTask = phaseTwoTask.thenRunAsync(phaseService::progressPhaseOne);

            CompletableFuture.allOf(phaseTwoTask, phaseOneTask).join();
        }

        private static LocalDateTime calculateStartDate() {
            LocalDateTime now = LocalDateTime.now();
            LocalTime phaseStartTime = LocalTime.of(18, 0);
            return now.plusDays(START_DELAY_PERIOD).with(phaseStartTime);
        }

        private static LocalDateTime calculateEndDate(LocalDateTime startDateTime, int phaseDurationInDays) {
            return startDateTime.plusDays(phaseDurationInDays * 2L + 1);
        }

}
