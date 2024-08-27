package com.photo_contest.services.contracts;

import com.photo_contest.models.Contest;
import com.photo_contest.models.DTO.CreateContestDTO;

import java.util.List;

public interface ContestService {
    public Contest createContest(CreateContestDTO createContestDTO);
    public void deleteContest();
    public Contest updateContest();
    public List<Contest> getAllContest();
    public Contest getContestById();
    public Contest getContestByTitle();

}
