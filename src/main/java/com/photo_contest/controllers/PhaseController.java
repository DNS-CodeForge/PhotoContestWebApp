package com.photo_contest.controllers;

import com.photo_contest.models.Contest;
import com.photo_contest.services.contracts.PhaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/phases")
public class PhaseController {

    private final PhaseService phaseService;

    @Autowired
    public PhaseController(PhaseService phaseService) {
        this.phaseService = phaseService;
    }

    @PostMapping("/create")
    public String createPhase(@RequestParam("contestId") Long contestId, @RequestParam("duration") int duration) {

        Contest contest = new Contest();
        contest.setId(contestId);

        phaseService.createPhase(contest, duration);

        return "Phase created successfully!";
    }
}
