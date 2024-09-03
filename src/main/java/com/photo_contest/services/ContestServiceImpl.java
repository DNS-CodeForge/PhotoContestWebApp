package com.photo_contest.services;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import com.photo_contest.exeptions.AuthorizationException;
import com.photo_contest.models.UserProfile;
import com.photo_contest.repos.RoleRepository;
import com.photo_contest.repos.UserProfileRepository;
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
import static com.photo_contest.services.PhaseServiceImpl.DAILY_CHECK_HOUR;


@Service
public class ContestServiceImpl implements ContestService {

    public static final int START_DELAY_PERIOD = 1;

    private final ContestRepository contestRepository;
    private final PhotoSubmissionRepository photoSubmissionRepository;
    private final AuthContextManager authContextManager;
    private final PhaseService phaseService;
    private final UserProfileRepository userProfileRepository;
    private final RoleRepository roleRepository;

    @Autowired
    public ContestServiceImpl(ContestRepository contestRepository, AuthContextManager authContextManager,
                              PhaseService phaseService, PhotoSubmissionRepository photoSubmissionRepository,
                              UserProfileRepository userProfileRepository,
                              RoleRepository roleRepository) {
        this.contestRepository = contestRepository;
        this.authContextManager = authContextManager;
        this.phaseService = phaseService;
        this.photoSubmissionRepository = photoSubmissionRepository;
        this.userProfileRepository = userProfileRepository;
        this.roleRepository = roleRepository;
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
        UserProfile organizer = authContextManager.getLoggedInUser();
        contest.setOrganizer(organizer);
        contest.setJury(List.of(organizer));
        // #TODO: Test Immutability
        contest.setParticipants(List.of());
        contest.setPhotoSubmissions(List.of());

        Contest savedContest = contestRepository.save(contest);


        Phase phaseOne = phaseService.createPhaseOne(savedContest, createContestDTO.getPhaseDurationInDays());
        Phase phaseTwo = phaseService.createPhaseTwo(savedContest, phaseTwoStartDateTime, createContestDTO.getPhaseTwoDurationInHours());


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
        LocalTime phaseStartTime = LocalTime.of(DAILY_CHECK_HOUR, 0);
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

    @Override
    public void joinContest(Long contestId, Long userId) {


        Contest contest = contestRepository.findById(contestId)
                .orElseThrow(() -> new IllegalArgumentException("Contest not found"));
        UserProfile userProfile = authContextManager.getLoggedInUser();

        if (contest.getParticipants().stream().anyMatch(participant -> Objects.equals(participant.getId(), userId))) {
            throw new IllegalStateException("User is already a participant");
        }

        if (!contest.isPrivate()) {
            userProfile.getContests().add(contest);


            contest.getParticipants().add(userProfile);
            userProfile.setPoints(userProfile.getPoints() + 1);

            userProfileRepository.save(userProfile);
            contestRepository.save(contest);
        } else {
            throw new IllegalStateException("Cannot join a private contest");
        }

    }

    @Override
    public void inviteParticipant(Long contestId, Long userId) {
        Contest contest = contestRepository.findById(contestId)
                .orElseThrow(() -> new IllegalArgumentException("Contest not found"));
        if (!Objects.equals(contest.getOrganizer().getId(), authContextManager.getLoggedInUser().getId())) {
            throw new IllegalStateException("Only the organizer can invite participants");
        }
        UserProfile userProfile = userProfileRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (contest.getParticipants().stream().anyMatch(participant -> Objects.equals(participant.getId(), userId))) {
            throw new IllegalStateException("User is already a participant");
        }
        int points = 1;

        if (contest.isPrivate()) {
            points = 3;
        }


        contest.getParticipants().add(userProfile);
        userProfile.getContests().add(contest);
        userProfile.setPoints(userProfile.getPoints() + points);

        contestRepository.save(contest);
        userProfileRepository.save(userProfile);
    }

    @Override
    public void inviteJudge(Long contestId, Long userId) {
        Contest contest = contestRepository.findById(contestId)
                .orElseThrow(() -> new IllegalArgumentException("Contest not found"));
        UserProfile userProfile = userProfileRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (!Objects.equals(contest.getOrganizer().getId(), authContextManager.getLoggedInUser().getId())) {
            throw new IllegalStateException("Only the organizer can invite judges");
        }
        if (contest.getJury().stream().anyMatch(judge -> Objects.equals(judge.getId(), userId))) {
            throw new IllegalStateException("User is already a judge");
        }
        if (contest.getParticipants().stream().anyMatch(participant -> Objects.equals(participant.getId(), userId))) {
            throw new IllegalStateException("User is already a participant");
        }
        if (!userProfile.getAppUser().getAuthorities().contains(roleRepository.findByAuthority("MASTERUSER").get())) {
           throw new AuthorizationException("User is not eligible to be a judge");
        }

        contest.getJury().add(userProfile);

        contestRepository.save(contest);
        userProfileRepository.save(userProfile);
    }

    public int getCurrentPhase(Long contestId) {
        Contest contest = contestRepository.findById(contestId)
                .orElseThrow(() -> new IllegalArgumentException("Contest not found"));

        LocalDateTime now = LocalDateTime.now();

        if (now.isBefore(contest.getStartDate())) {
            return 0;
        }

        List<Phase> phases = contest.getPhases();

        for (Phase phase : phases) {
            if (now.isAfter(phase.getStartDateTime()) && now.isBefore(phase.getEndDateTime())) {
                return phases.indexOf(phase) + 1;
            }
        }
            return 3;
    }

}
