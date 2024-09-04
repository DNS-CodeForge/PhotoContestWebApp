package com.photo_contest.controllers;

import java.util.List;

import com.photo_contest.models.Contest;
import com.photo_contest.models.DTO.CreateContestDTO;
import com.photo_contest.models.DTO.RankedUserResponseDTO;
import com.photo_contest.repos.UserRepository;
import com.photo_contest.services.contracts.ContestService;
import com.photo_contest.services.contracts.UserService;
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

import static com.photo_contest.constants.ModelValidationConstants.*;


@RestController
@RequestMapping("/api/contest")
public class ContestController {



    private final ContestService contestService;
    private final ContestUtils contestUtils;

    @Autowired
    public ContestController(ContestService contestService, ContestUtils contestUtils, UserRepository userRepository, UserService userService) {
        this.contestService = contestService;
        this.contestUtils = contestUtils;
    }


    @PostMapping
    public ResponseEntity<Contest> createContest(@RequestBody CreateContestDTO createContestDTO) {
        Contest createdContest = contestService.createContest(createContestDTO);
        return new ResponseEntity<>(createdContest, HttpStatus.CREATED);
    }


    @GetMapping
    public ResponseEntity<List<Contest>> getAllContests() {
        List<Contest> contests = contestService.getAllContest();
        return new ResponseEntity<>(contests, HttpStatus.OK);
    }


    @GetMapping("/{id}/ranking")
    public ResponseEntity<List<RankedUserResponseDTO>> getCurrentRanking(@PathVariable int id){
        List<RankedUserResponseDTO> ranking = contestService.getCurrentRanking(id);
        return new ResponseEntity<>(ranking, HttpStatus.OK);
    }


    @PostMapping("/{id}/award-points")
    public ResponseEntity<List<RankedUserResponseDTO>> awardPoints(@PathVariable Long id) {
        List<RankedUserResponseDTO> awardedPoints = contestUtils.awardPointsForContest(id);
        return new ResponseEntity<>(awardedPoints, HttpStatus.OK);
    }


    @PostMapping("/{contestId}/participants/invite")
    public ResponseEntity<String> inviteParticipants(
            @PathVariable Long contestId,
            @RequestBody List<Long> userIds) {
        try {
            List<Long> failedInvites = contestService.inviteParticipants(contestId, userIds);
            if (failedInvites.isEmpty()) {
                return ResponseEntity.ok(PARTICIPANTS_INVITED_SUCCESSFULLY);
            } else {
                return ResponseEntity.status(HttpStatus.OK)
                        .body(PARTICIPANTS_FAILED_INVITES + failedInvites);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(PARTICIPANTS_INVITE_FAILED + e.getMessage());
        }
    }


    @PostMapping("/{contestId}/judges/invite")
    public ResponseEntity<String> inviteJudges(
            @PathVariable Long contestId,
            @RequestBody List<Long> userIds) {
        try {
            List<Long> failedInvites = contestService.inviteJudges(contestId, userIds);
            if (failedInvites.isEmpty()) {
                return ResponseEntity.ok(JUDGES_INVITED_SUCCESSFULLY);
            } else {
                return ResponseEntity.status(HttpStatus.OK)
                        .body(JUDGES_FAILED_INVITES + failedInvites);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(JUDGES_INVITE_FAILED + e.getMessage());
        }
    }
}
