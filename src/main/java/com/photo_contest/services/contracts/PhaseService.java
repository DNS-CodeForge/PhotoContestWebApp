package com.photo_contest.services.contracts;

import com.photo_contest.models.Contest;
import com.photo_contest.models.Phase;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface PhaseService {
    Phase createPhaseOne(Contest contest, int durationInDays);
    Phase createPhaseTwo(Contest contest, LocalDateTime startDateTime, int durationInHours);


    List<Phase> getAllPhases();
    List<Phase> getAllPhases(String phaseType);
    Optional<Phase> getPhaseById(Long phaseId);
    void progressPhaseOne();
    void progressPhaseTwo();
    void checkAndProgressPhaseOneDaily();
    void checkAndConcludePhaseTwoHourly();
}
