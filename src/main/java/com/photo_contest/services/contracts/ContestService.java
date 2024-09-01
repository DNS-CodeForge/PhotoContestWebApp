package com.photo_contest.services.contracts;

import com.photo_contest.models.Contest;
import com.photo_contest.models.DTO.CreateContestDTO;

import java.util.List;
import java.util.Optional;

public interface ContestService {
    public Contest createContest(CreateContestDTO createContestDTO);
    public void deleteContest();
    public Optional<Contest> getContestByName();
    public Contest updateContest();
    public List<Contest> getAllContest();
    public Contest getContestById();
    public Contest getContestByTitle();

}
