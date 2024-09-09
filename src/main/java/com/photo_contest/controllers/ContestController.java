package com.photo_contest.controllers;
import java.util.List;

import com.photo_contest.models.Contest;
import com.photo_contest.models.DTO.CreateContestDTO;
import com.photo_contest.models.DTO.RankedUserResponseDTO;

import com.photo_contest.services.contracts.ContestService;

import com.photo_contest.utils.ContestUtils;

import com.photo_contest.utils.CustomResponse;
import com.photo_contest.utils.ResponseUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import static com.photo_contest.constants.ModelValidationConstants.*;

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
    public ResponseEntity<Contest> createContest(@RequestBody CreateContestDTO createContestDTO) {
        Contest createdContest = contestService.createContest(createContestDTO);
        return ResponseEntity.status(201).body(createdContest);
    }

    @GetMapping
    public ResponseEntity<CustomResponse> getAllContests(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Boolean isPrivate,
            @RequestParam(required = false) Boolean active,
            @RequestParam(required = false) Boolean activeSubmission,
            @RequestParam(required = false) String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            HttpServletRequest request
    ) {
        Pageable pageable = PageRequest.of(page, size);

        Page<Contest> contestPage = contestService.getContests(title, category, isPrivate, active, activeSubmission, sort, pageable);

        UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(request.getRequestURL().toString())
                .query(request.getQueryString());

        CustomResponse response = ResponseUtil.buildPaginatedContestResponse(contestPage, uriBuilder);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/ranking")
    public ResponseEntity<List<RankedUserResponseDTO>> getCurrentRanking(@PathVariable int id) {
        List<RankedUserResponseDTO> ranking = contestService.getCurrentRanking(id);
        return ResponseEntity.ok(ranking);
    }

    @PostMapping("/{id}/award-points")
    public ResponseEntity<List<RankedUserResponseDTO>> awardPoints(@PathVariable Long id) {
        List<RankedUserResponseDTO> awardedPoints = contestUtils.awardPointsForContest(id);
        return ResponseEntity.ok(awardedPoints);
    }

    @PostMapping("/{contestId}/participants/invite")
    public ResponseEntity<String> inviteParticipants(
            @PathVariable Long contestId,
            @RequestBody List<Long> userIds) {
        List<Long> failedInvites = contestService.inviteParticipants(contestId, userIds);
        if (failedInvites.isEmpty()) {
            return ResponseEntity.ok(PARTICIPANTS_INVITED_SUCCESSFULLY);
        } else {
            return ResponseEntity.ok(PARTICIPANTS_FAILED_INVITES + failedInvites);
        }
    }

    @PostMapping("/{contestId}/judges/invite")
    public ResponseEntity<String> inviteJudges(
            @PathVariable Long contestId,
            @RequestBody List<Long> userIds) {
        List<Long> failedInvites = contestService.inviteJudges(contestId, userIds);
        if (failedInvites.isEmpty()) {
            return ResponseEntity.ok(JUDGES_INVITED_SUCCESSFULLY);
        } else {
            return ResponseEntity.ok(JUDGES_FAILED_INVITES + failedInvites);
        }
    }
}
