package com.photo_contest.services.contracts;

import java.util.List;
import java.util.Optional;

import com.photo_contest.models.Contest;
import com.photo_contest.models.DTO.CreateContestDTO;
import com.photo_contest.models.DTO.RankedUserResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ContestService {
     Contest createContest(CreateContestDTO createContestDTO);
     void deleteContest(Long contestId);
     Optional<Contest> getContestByTitle(String title);
     Contest updateContest(Long contestId, CreateContestDTO updateContestDTO);
    Page<Contest> getContests(String title, String category, Boolean isPrivate,Boolean active,
                              Boolean activeSubmission, String sort, Pageable pageable);
     Optional<Contest> getContestById(Long contestId);
    Contest saveContest(Contest contest);
    List<RankedUserResponseDTO> getCurrentRanking(int contestId);
     void joinContest(Long contestId, Long userId);
     List<Long> inviteParticipants(Long contestId, List<Long> userIds);
     List<Long> inviteJudges(Long contestId, List<Long> userId);
     int getCurrentPhase(Long contestId);
}
