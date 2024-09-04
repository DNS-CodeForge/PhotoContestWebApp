package com.photo_contest.controllers;

import java.util.List;

import com.photo_contest.models.Contest;
import com.photo_contest.models.DTO.CreateContestDTO;
import com.photo_contest.models.DTO.RankedUserResponseDTO;
import com.photo_contest.repos.PhotoSubmissionRepository;
import com.photo_contest.services.contracts.ContestService;

import com.photo_contest.utils.ContestUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    private final ContestUtils contestUtils;

    @Autowired
    public ContestController(ContestService contestService, ContestUtils contestUtils) {
        this.contestService = contestService;

        this.contestUtils = contestUtils;
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

        return contestUtils.awardPointsForContest(id);

    }

    @PostMapping("/{contestId}/inviteParticipants")
    public ResponseEntity<String> inviteParticipants(
            @PathVariable Long contestId,
            @RequestBody List<Long> userIds) {
        try {
            contestService.inviteParticipants(contestId, userIds);
            return ResponseEntity.ok("Participants invited successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to invite participants: " + e.getMessage());
        }
    }

    @PostMapping("/{contestId}/inviteJudges")
    public ResponseEntity<String> inviteJudges(
            @PathVariable Long contestId,
            @RequestBody List<Long> userIds) {
        try {
            contestService.inviteJudges(contestId, userIds);
            return ResponseEntity.ok("Judges invited successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to invite judges: " + e.getMessage());
        }
    }
}
