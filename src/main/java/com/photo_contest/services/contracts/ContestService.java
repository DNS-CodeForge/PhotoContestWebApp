package com.photo_contest.services.contracts;

import com.photo_contest.models.Contest;
import com.photo_contest.models.DTO.CreateContestDTO;

import java.util.List;
import java.util.Optional;

public interface ContestService {
    public Contest createContest(CreateContestDTO createContestDTO);
    public void deleteContest(Long contestId);
    public Optional<Contest> getContestByTitle(String title);
    public Contest updateContest(Long contestId, CreateContestDTO updateContestDTO);
    public List<Contest> getAllContest();
    public Optional<Contest> getContestById(Long contestId);
    Contest saveContest(Contest contest);
//    void checkAndProgressPhaseOneDaily();
//    void checkAndConcludePhaseTwoHourly();

}
