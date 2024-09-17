package com.photo_contest.services;

import static com.photo_contest.constants.ModelValidationConstants.CONTEST_EXISTS;
import static com.photo_contest.constants.ModelValidationConstants.INVALID_ID;
import static com.photo_contest.constants.ModelValidationConstants.NOT_ORGANIZER;
import static com.photo_contest.constants.ModelValidationConstants.PRIVATE_CONTEST;
import static com.photo_contest.services.PhaseServiceImpl.DAILY_CHECK_HOUR;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;

import com.photo_contest.config.AuthContextManager;
import com.photo_contest.exeptions.AuthorizationException;
import com.photo_contest.filterSpec.ContestFilterSpecification;
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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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

        Contest contest = createNewContest(createContestDTO, startDateTime, contestEndDate, phaseOneEndDate);
        contest.setPrivate(createContestDTO.isPrivate());
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

    public Page<Contest> getContestsByOrganizerId(int page, int size) {
        UserProfile loggedInUser = authContextManager.getLoggedInUser(); // Get the logged-in user
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")); // Sort by createdAt in descending order

        return contestRepository.findByOrganizerId(loggedInUser.getId(), pageRequest);
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

        boolean isParticipant = contest.getParticipants().stream()
                .anyMatch(participant -> Objects.equals(participant.getId(), userId));

        if (!contest.isPrivate()) {
            if (isParticipant) {
                userProfile.setPoints(userProfile.getPoints() + 1);
            } else {
                userProfile.getContests().add(contest);
                contest.getParticipants().add(userProfile);
                userProfile.setPoints(userProfile.getPoints() + 1);
            }

            userProfileRepository.save(userProfile);
            contestRepository.save(contest);

        } else {
            if (isParticipant) {
                userProfile.setPoints(userProfile.getPoints() + 3);
                userProfileRepository.save(userProfile);
            } else {
                throw new AuthorizationException(PRIVATE_CONTEST);
            }
        }
    }

    @Override
    public List<Long> inviteParticipants(Long contestId, List<Long> userIds) {
        Contest contest = contestRepository.findById(contestId)
                .orElseThrow(() -> new EntityNotFoundException(INVALID_ID.formatted("Contest", contestId)));

        if (!Objects.equals(contest.getOrganizer().getId(), authContextManager.getLoggedInUser().getId())) {
            throw new AuthorizationException(NOT_ORGANIZER.formatted("participants"));
        }

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

    private Contest createNewContest(CreateContestDTO createContestDTO, LocalDateTime startDateTime, LocalDateTime contestEndDate, LocalDateTime submissionEndDate) {
        Contest contest = new Contest();
        contest.setTitle(createContestDTO.getTitle());
        contest.setCategory(createContestDTO.getCategory());
        contest.setStartDate(startDateTime);
        contest.setEndDate(contestEndDate);
        contest.setSubmissionEndDate(submissionEndDate);
        UserProfile organizer = authContextManager.getLoggedInUser();
        contest.setOrganizer(organizer);
        contest.setJury(List.of(organizer));
        contest.setParticipants(List.of());
        contest.setPhotoSubmissions(List.of());
        return contest;
    }

    @Override
    public List<Contest> findAllContestsByUserProfileId(long id) {
        return contestRepository.findAllContestsByUserProfileId(id);
    }

}
