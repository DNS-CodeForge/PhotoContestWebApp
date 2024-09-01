package com.photo_contest.services;

import com.photo_contest.models.Contest;
import com.photo_contest.models.Phase;
import com.photo_contest.repos.PhaseRepository;
import com.photo_contest.services.contracts.PhaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
public class PhaseServiceImpl implements PhaseService {

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

    public void progressPhaseOne() {
        List<Phase> activePhases = phaseRepository.findByType(Phase.PhaseType.PHASE_ONE);
        LocalDateTime now = LocalDateTime.now();

        for (Phase phase : activePhases) {
            if (now.isAfter(phase.getEndDateTime()) && !phase.isConcluded()) {

                phase.setConcluded(true);
                phaseRepository.save(phase);

                Contest contest = phase.getContest();

                LocalDateTime startDateTime = calculateStartDateTime(now);
                LocalDateTime endDateTime = startDateTime.plusDays(3);

                Phase newPhase = new Phase();
                newPhase.setType(Phase.PhaseType.PHASE_TWO);
                newPhase.setStartDateTime(startDateTime);
                newPhase.setEndDateTime(endDateTime);
                newPhase.setContest(contest);
                newPhase.setConcluded(false);

                phaseRepository.save(newPhase);
            }
        }
    }
    //    #TODO: should be in hours set at creation
    @Override
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

    private LocalDateTime calculateStartDateTime(LocalDateTime now) {
        LocalTime phaseStartTime = LocalTime.of(18, 0);
        if (now.toLocalTime().isBefore(phaseStartTime)) {
            return now.with(phaseStartTime);
        } else {
            return now.plusDays(1).with(phaseStartTime);
        }
    }
}
