package com.photo_contest.services;

import com.photo_contest.models.Contest;
import com.photo_contest.models.Phase;
import com.photo_contest.repos.PhaseRepository;
import com.photo_contest.services.contracts.PhaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Service
public class PhaseServiceImpl implements PhaseService {

    private final PhaseRepository phaseRepository;


    @Autowired
    public PhaseServiceImpl(PhaseRepository phaseRepository) {
        this.phaseRepository = phaseRepository;
    }

    @Override
    public void createPhase(Contest contest) {
        LocalDateTime now = LocalDateTime.now();
        LocalTime phaseStartTime = LocalTime.of(18, 0);

        LocalDateTime startDateTime;


        if (now.toLocalTime().isBefore(phaseStartTime)) {
            startDateTime = now.with(phaseStartTime);
        } else {
            startDateTime = now.plusDays(1).with(phaseStartTime);
        }

        LocalDateTime endDateTime = startDateTime.plusDays(3);




        Phase newPhase = new Phase();
        newPhase.setType(Phase.PhaseType.PHASE_ONE);
        newPhase.setStartDateTime(startDateTime);
        newPhase.setEndDateTime(endDateTime);
        newPhase.setContest(contest);


        phaseRepository.save(newPhase);
    }

    @Override
    public void deletePhase() {

    }

    @Override
    public void updatePhase() {

    }

    @Override
    public void getAllPhases() {

    }

    @Override
    public void getAllPhases(String phaseType) {

    }

    @Override
    public void getContestID() {

    }

    @Override
    public void progressPhases() {

    }
}
