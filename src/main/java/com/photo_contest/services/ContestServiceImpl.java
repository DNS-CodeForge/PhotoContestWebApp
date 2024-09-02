package com.photo_contest.services;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

import jakarta.persistence.EntityExistsException;

import com.photo_contest.config.AuthContextManager;
import com.photo_contest.models.Contest;
import com.photo_contest.models.Phase;
import com.photo_contest.models.DTO.CreateContestDTO;
import com.photo_contest.models.DTO.RankedUserResponseDTO;
import com.photo_contest.repos.ContestRepository;
import com.photo_contest.repos.PhotoSubmissionRepository;
import com.photo_contest.services.contracts.ContestService;
import com.photo_contest.services.contracts.PhaseService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;



@Service
public class ContestServiceImpl implements ContestService {

    public static final int START_DELAY_PERIOD = 1;

    private final ContestRepository contestRepository;
    private final PhotoSubmissionRepository photoSubmissionRepository;
    private final AuthContextManager authContextManager;
    private final PhaseService phaseService;

    @Autowired
    public ContestServiceImpl(ContestRepository contestRepository, AuthContextManager authContextManager, PhaseService phaseService, PhotoSubmissionRepository photoSubmissionRepository) {
        this.contestRepository = contestRepository;
        this.authContextManager = authContextManager;
        this.phaseService = phaseService;
        this.photoSubmissionRepository = photoSubmissionRepository;
    }

    @Override
    public Contest createContest(CreateContestDTO createContestDTO) {
        if (contestRepository.findByTitle(createContestDTO.getTitle()).isPresent()) {
            throw new EntityExistsException("Contest with this title already exists");
        }

        LocalDateTime startDateTime = calculateStartDate().truncatedTo(ChronoUnit.MINUTES);
        LocalDateTime phaseOneEndDate = calculatePhaseOneEndDate(startDateTime, createContestDTO.getPhaseDurationInDays()).truncatedTo(ChronoUnit.MINUTES);
        LocalDateTime phaseTwoStartDateTime = phaseOneEndDate.plusDays(1).truncatedTo(ChronoUnit.MINUTES);
        LocalDateTime contestEndDate = calculateEndDate(phaseTwoStartDateTime, createContestDTO.getPhaseTwoDurationInHours()).truncatedTo(ChronoUnit.MINUTES);


        Contest contest = new Contest();
        contest.setTitle(createContestDTO.getTitle());
        contest.setCategory(createContestDTO.getCategory());
        contest.setStartDate(startDateTime);
        contest.setEndDate(contestEndDate);
        contest.setOrganizer(authContextManager.getLoggedInUser());

        Contest savedContest = contestRepository.save(contest);


        Phase phaseOne = phaseService.createPhase(savedContest, createContestDTO.getPhaseDurationInDays());
        Phase phaseTwo = phaseService.createPhase(savedContest, phaseTwoStartDateTime, createContestDTO.getPhaseTwoDurationInHours());


        savedContest.setPhases(List.of(phaseOne, phaseTwo));
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

    private static LocalDateTime calculateStartDate() {
        LocalDateTime now = LocalDateTime.now();
        LocalTime phaseStartTime = LocalTime.of(18, 0);
        return now.plusDays(START_DELAY_PERIOD).with(phaseStartTime);
    }

    private static LocalDateTime calculatePhaseOneEndDate(LocalDateTime startDateTime, int phaseDurationInDays) {
        return startDateTime.plusDays(phaseDurationInDays);
    }

    private static LocalDateTime calculateEndDate(LocalDateTime phaseTwoStartDateTime, int phaseTwoDurationInHours) {
        return phaseTwoStartDateTime.plusHours(phaseTwoDurationInHours);
    }

    @Override
    public List<RankedUserResponseDTO> getCurrentRanking(int contestId) {
        return photoSubmissionRepository.getRankingsByContestId((long) contestId);
    }
}
