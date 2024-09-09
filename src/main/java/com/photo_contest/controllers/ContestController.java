package com.photo_contest.controllers;
import static com.photo_contest.constants.ModelValidationConstants.JUDGES_FAILED_INVITES;
import static com.photo_contest.constants.ModelValidationConstants.JUDGES_INVITED_SUCCESSFULLY;
import static com.photo_contest.constants.ModelValidationConstants.JUDGES_INVITE_FAILED;
import static com.photo_contest.constants.ModelValidationConstants.PARTICIPANTS_FAILED_INVITES;
import static com.photo_contest.constants.ModelValidationConstants.PARTICIPANTS_INVITED_SUCCESSFULLY;
import static com.photo_contest.constants.ModelValidationConstants.PARTICIPANTS_INVITE_FAILED;

import java.util.List;

import jakarta.servlet.http.HttpServletRequest;

import com.photo_contest.models.Contest;
import com.photo_contest.models.DTO.CreateContestDTO;
import com.photo_contest.models.DTO.RankedUserResponseDTO;
import com.photo_contest.services.contracts.ContestService;
import com.photo_contest.utils.ContestUtils;
import com.photo_contest.utils.CustomResponse;
import com.photo_contest.utils.ResponseUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;


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
        return new ResponseEntity<>(createdContest, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Contest> getSingleContest(@PathVariable Long id) {
        Contest contest = contestService.getContestById(id).get();
        if (contest != null) {
            return new ResponseEntity<>(contest, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
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
    public ResponseEntity<List<RankedUserResponseDTO>> getCurrentRanking(
    @PathVariable int id, 
    @RequestParam(value = "limit", required = false) Integer limit) {

        List<RankedUserResponseDTO> ranking = contestService.getCurrentRanking(id);

        if (limit != null && limit > 0 && limit < ranking.size()) {
            ranking = ranking.subList(0, limit);
        }

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
