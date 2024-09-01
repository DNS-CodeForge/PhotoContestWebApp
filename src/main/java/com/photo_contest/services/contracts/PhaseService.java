package com.photo_contest.services.contracts;

import com.photo_contest.models.Contest;
import com.photo_contest.models.Phase;

import java.util.List;
import java.util.Optional;

public interface PhaseService {
    Phase createPhase(Contest contest, int duration);
    void deletePhase(Long phaseId);
    void updatePhase(Long phaseId, Phase updatedPhase);
    List<Phase> getAllPhases();
    List<Phase> getAllPhases(String phaseType);
    Optional<Phase> getPhaseById(Long phaseId);
    void progressPhaseOne();
    void progressPhaseTwo();
}
