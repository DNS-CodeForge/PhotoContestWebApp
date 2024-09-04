package com.photo_contest.services.contracts;

import java.util.List;
import java.util.Optional;

import com.photo_contest.models.Contest;
import com.photo_contest.models.DTO.CreateContestDTO;
import com.photo_contest.models.DTO.RankedUserResponseDTO;

public interface ContestService {
    public Contest createContest(CreateContestDTO createContestDTO);
    public void deleteContest(Long contestId);
    public Optional<Contest> getContestByTitle(String title);
    public Contest updateContest(Long contestId, CreateContestDTO updateContestDTO);
    public List<Contest> getAllContest();
    public Optional<Contest> getContestById(Long contestId);
    Contest saveContest(Contest contest);
    List<RankedUserResponseDTO> getCurrentRanking(int contestId);
    public void joinContest(Long contestId, Long userId);
    public List<Long> inviteParticipants(Long contestId, List<Long> userIds);
    public List<Long> inviteJudges(Long contestId, List<Long> userId);
    public int getCurrentPhase(Long contestId);
}
