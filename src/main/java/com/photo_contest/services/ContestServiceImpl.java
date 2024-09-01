package com.photo_contest.services;

import com.photo_contest.config.AuthContextManager;
import com.photo_contest.models.Contest;
import com.photo_contest.models.DTO.CreateContestDTO;
import com.photo_contest.repos.ContestRepository;
import com.photo_contest.services.contracts.ContestService;
import jakarta.persistence.EntityExistsException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
public class ContestServiceImpl implements ContestService {
    private final ContestRepository contestRepository;
    private final AuthContextManager authContextManager;

    @Autowired
    public ContestServiceImpl(ContestRepository contestRepository, AuthContextManager authContextManager) {
        this.contestRepository = contestRepository;
        this.authContextManager = authContextManager;
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



        return contestRepository.save(contest);
    }



    @Override
    public void deleteContest() {

    }

    @Override
    public Optional<Contest> getContestByName() {
        if (contestRepository.findByTitle("title").isPresent()) {
            return contestRepository.findByTitle("title");
        }
        return Optional.empty();
    }


    @Override
    public Contest updateContest() {
        return null;
    }

    @Override
    public List<Contest> getAllContest() {
        return contestRepository.findAll();
    }

    @Override
    public Contest getContestById() {
        return null;
    }

    @Override
    public Contest getContestByTitle() {
        return null;
    }

    private static LocalDateTime calculateStartDate() {
        LocalDateTime now = LocalDateTime.now();
        LocalTime phaseStartTime = LocalTime.of(18, 0);


        return now.plusDays(2).with(phaseStartTime);
    }

    private static LocalDateTime calculateEndDate(LocalDateTime startDateTime, int phaseDurationInDays) {
        return startDateTime.plusDays(phaseDurationInDays * 2L);
    }
}
