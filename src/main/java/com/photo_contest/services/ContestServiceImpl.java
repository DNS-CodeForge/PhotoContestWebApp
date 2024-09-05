package com.photo_contest.services;

import static com.photo_contest.constants.ModelValidationConstants.*;
import static com.photo_contest.services.PhaseServiceImpl.DAILY_CHECK_HOUR;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import com.photo_contest.exeptions.AuthorizationException;
import com.photo_contest.filterSpec.ContestFilterSpecification;
import jakarta.persistence.EntityExistsException;

import com.photo_contest.config.AuthContextManager;
import com.photo_contest.models.Contest;
import com.photo_contest.models.Phase;
import com.photo_contest.models.UserProfile;
import com.photo_contest.models.DTO.CreateContestDTO;
import com.photo_contest.models.DTO.RankedUserResponseDTO;
import com.photo_contest.repos.ContestRepository;
import com.photo_contest.repos.PhotoSubmissionRepository;
import com.photo_contest.repos.RoleRepository;
import com.photo_contest.repos.UserProfileRepository;
import com.photo_contest.services.contracts.ContestService;
import com.photo_contest.services.contracts.PhaseService;
import com.photo_contest.services.contracts.UserService;
import com.photo_contest.utils.ContestUtils;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;


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
                              RoleRepository roleRepository
                              ) {
        this.contestRepository = contestRepository;
        this.authContextManager = authContextManager;
        this.phaseService = phaseService;
        this.photoSubmissionRepository = photoSubmissionRepository;
        this.userProfileRepository = userProfileRepository;
        this.roleRepository = roleRepository;
       ;
    }

    @Override
    public Contest createContest(CreateContestDTO createContestDTO) {
        if (contestRepository.findByTitle(createContestDTO.getTitle()).isPresent()) {
            throw new EntityExistsException(CONTEST_EXISTS);
        }
        LocalDateTime startDateTime = calculateStartDate().truncatedTo(ChronoUnit.MINUTES);
        LocalDateTime phaseOneEndDate = calculatePhaseOneEndDate(startDateTime, createContestDTO.getPhaseDurationInDays()).truncatedTo(ChronoUnit.MINUTES);
        LocalDateTime phaseTwoStartDateTime = phaseOneEndDate.plusDays(1).truncatedTo(ChronoUnit.MINUTES);
        LocalDateTime contestEndDate = calculateEndDate(phaseTwoStartDateTime, createContestDTO.getPhaseTwoDurationInHours()).truncatedTo(ChronoUnit.MINUTES);
// TODO: Refactor
        Contest contest = createNewContest(createContestDTO, startDateTime, contestEndDate);
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
            throw new EntityNotFoundException(INVALID_ID.formatted("Contest", contestId));
        }
    }

    @Override
    public Page<Contest> getContests(String title, String category, Boolean isPrivate,Boolean active, Boolean activeSubmission, String sort, Pageable pageable) {

        Specification<Contest> spec = ContestFilterSpecification.withFiltersAndSort(title, category, isPrivate,
                active, activeSubmission, sort);


        return contestRepository.findAll(spec, pageable);
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
                .orElseThrow(() -> new EntityNotFoundException(INVALID_ID.formatted("Contest", contestId)));
        UserProfile userProfile = authContextManager.getLoggedInUser();

        if (contest.getParticipants().stream().anyMatch(participant -> Objects.equals(participant.getId(), userId))) {
            throw new AuthorizationException(USER_IS_ALREADY_A_PARTICIPANT);
        }

        if (!contest.isPrivate()) {
            userProfile.getContests().add(contest);


            contest.getParticipants().add(userProfile);
            userProfile.setPoints(userProfile.getPoints() + 1);

            userProfileRepository.save(userProfile);
            contestRepository.save(contest);
        } else {
            throw new AuthorizationException(PRIVATE_CONTEST);
        }

    }

    @Override
    public List<Long> inviteParticipants(Long contestId, List<Long> userIds) {
        Contest contest = contestRepository.findById(contestId)
                .orElseThrow(() -> new EntityNotFoundException(INVALID_ID.formatted("Contest", contestId)));


        if (!Objects.equals(contest.getOrganizer().getId(), authContextManager.getLoggedInUser().getId())) {
            throw new AuthorizationException(NOT_ORGANIZER.formatted("participants"));
        }


        int points = contest.isPrivate() ? 3 : 1;
        List<Long> failedInvites = new ArrayList<>();

        for (Long userId : userIds) {
            try {
                UserProfile userProfile = userProfileRepository.findById(userId)
                        .orElseThrow(() -> new EntityNotFoundException(INVALID_ID.formatted("User", contestId)));

                if (contest.getParticipants().stream().anyMatch(participant -> Objects.equals(participant.getId(), userId))) {
                    continue;
                }

                contest.getParticipants().add(userProfile);
                userProfile.getContests().add(contest);
                userProfile.setPoints(userProfile.getPoints() + points);

            } catch (Exception e) {
                failedInvites.add(userId);
            }
        }
        contestRepository.save(contest);

        return failedInvites;
    }

    @Override
    public List<Long> inviteJudges(Long contestId, List<Long> userIds) {
        Contest contest = contestRepository.findById(contestId)
                .orElseThrow(() -> new EntityNotFoundException(INVALID_ID.formatted("Contest", contestId)));

        if (!Objects.equals(contest.getOrganizer().getId(), authContextManager.getLoggedInUser().getId())) {
            throw  new AuthorizationException(NOT_ORGANIZER.formatted("judges"));
        }

        List<Long> failedInvites = new ArrayList<>();

        for (Long userId : userIds) {
            try {
                UserProfile userProfile = userProfileRepository.findById(userId)
                        .orElseThrow(() -> new EntityNotFoundException(INVALID_ID.formatted("User", contestId)));

                if (contest.getJury().stream().anyMatch(judge -> Objects.equals(judge.getId(), userId)) ||
                        contest.getParticipants().stream().anyMatch(participant -> Objects.equals(participant.getId(), userId))) {
                    continue;
                }

                if (!userProfile.getAppUser().getAuthorities().contains(roleRepository.findByAuthority("MASTERUSER").get())) {
                    failedInvites.add(userId);
                    continue;
                }

                contest.getJury().add(userProfile);

            } catch (Exception e) {
                failedInvites.add(userId);
            }
        }
        contestRepository.save(contest);

        return failedInvites;
    }


    @Override
    public int getCurrentPhase(Long contestId) {
        Contest contest = contestRepository.findById(contestId)
                .orElseThrow(() -> new EntityNotFoundException(INVALID_ID.formatted("Contest", contestId)));

        LocalDateTime now = LocalDateTime.now();

        if (now.isBefore(contest.getStartDate())) {
            return 0;
        }

        List<Phase> phases = contest.getPhases();

        for (Phase phase : phases) {
            if (now.isAfter(phase.getStartDateTime()) && now.isBefore(phase.getEndDateTime())) {
                if (phase.getType().equals(Phase.PhaseType.PHASE_ONE)) {
                    return 1;
                } else {
                    return 2;
                }

            }
        }
            return 3;
    }

    private Contest createNewContest(CreateContestDTO createContestDTO, LocalDateTime startDateTime, LocalDateTime contestEndDate) {
        Contest contest = new Contest();
        contest.setTitle(createContestDTO.getTitle());
        contest.setCategory(createContestDTO.getCategory());
        contest.setStartDate(startDateTime);
        contest.setEndDate(contestEndDate);
        UserProfile organizer = authContextManager.getLoggedInUser();
        contest.setOrganizer(organizer);
        contest.setJury(List.of(organizer));
        contest.setParticipants(List.of());
        contest.setPhotoSubmissions(List.of());
        return contest;
    }

}
