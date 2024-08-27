package com.photo_contest.controllers;

import com.photo_contest.models.Contest;
import com.photo_contest.models.DTO.CreateContestDTO;
import com.photo_contest.services.contracts.ContestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contest")
public class ContestController {

    private final ContestService contestService;

    @Autowired
    public ContestController(ContestService contestService) {
        this.contestService = contestService;
    }

    @PostMapping
    public Contest createContest(@RequestBody CreateContestDTO createContestDTO) {
        return contestService.createContest(createContestDTO);
    }

    @GetMapping
    public List<Contest> getAllContests() {
        return contestService.getAllContest();
    }
}
