package com.photo_contest.services.contracts;

import com.photo_contest.models.Contest;

public interface PhaseService {
    public void createPhase(Contest contest);
    public void deletePhase();
    public void updatePhase();
    public void getAllPhases();
    public void getAllPhases(String phaseType);
    public void getContestID();
    public void progressPhases();
}
