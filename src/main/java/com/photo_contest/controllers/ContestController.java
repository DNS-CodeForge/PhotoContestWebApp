package com.photo_contest.controllers;

import java.util.List;

import com.photo_contest.models.Contest;
import com.photo_contest.models.DTO.CreateContestDTO;
import com.photo_contest.models.DTO.RankedUserResponseDTO;
import com.photo_contest.repos.PhotoSubmissionRepository;
import com.photo_contest.services.contracts.ContestService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contest")
public class ContestController {

    private final ContestService contestService;
    private final PhotoSubmissionRepository photoSubmissionRepository;

    @Autowired
    public ContestController(ContestService contestService, PhotoSubmissionRepository photoSubmissionRepository) {
        this.contestService = contestService;
        this.photoSubmissionRepository = photoSubmissionRepository;
    }

    @PostMapping
    public Contest createContest(@RequestBody CreateContestDTO createContestDTO) {
        return contestService.createContest(createContestDTO);
    }

    @GetMapping
    public List<Contest> getAllContests() {
        return contestService.getAllContest();
    }

    @GetMapping("/{id}/ranking")
    public List<RankedUserResponseDTO> getCurrentRanking(@PathVariable int id){
        return contestService.getCurrentRanking(id);

    }


    @PostMapping("/{id}/award-points")
    public List<RankedUserResponseDTO> awardPoints(@PathVariable Long id) {
    /*
        A Test endpoint to trigger the awarding of points for a contest without the scheduled task.
        DD
    */
        contestService.awardPointsForContest(id);
        return photoSubmissionRepository.getFinalScoresByContestId(id);

    }

}
