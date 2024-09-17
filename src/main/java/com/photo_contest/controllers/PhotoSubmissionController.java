package com.photo_contest.controllers;

import java.io.IOException;
import java.util.List;

import com.photo_contest.models.DTO.ContestPhotoDTO;
import com.photo_contest.models.PhotoSubmission;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.photo_contest.models.DTO.PhotoSubmissionDTO;
import com.photo_contest.services.contracts.PhotoSubmissionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
public class PhotoSubmissionController {

    private final PhotoSubmissionService photoSubmissionService;
    private final ObjectMapper objectMapper;

    @Autowired
    public PhotoSubmissionController(PhotoSubmissionService photoSubmissionService, ObjectMapper objectMapper) {
        this.photoSubmissionService = photoSubmissionService;
        this.objectMapper = objectMapper;
    }


    @PostMapping("/contest/{contestId}/submission")
    public ResponseEntity<PhotoSubmission> createPhotoSubmission(
            @PathVariable Long contestId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("data") String data) throws IOException {

        PhotoSubmissionDTO photoSubmissionDTO = objectMapper.readValue(data, PhotoSubmissionDTO.class);

        PhotoSubmission createdSubmission = photoSubmissionService.createPhotoSubmission(contestId, photoSubmissionDTO, file);
        return ResponseEntity.status(201).body(createdSubmission);
    }

    @GetMapping("/submission/{id}")
    public ResponseEntity<PhotoSubmission> getPhotoSubmissionById(@PathVariable Long id) {
        PhotoSubmission submission = photoSubmissionService.getPhotoSubmissionById(id);
        return ResponseEntity.ok(submission);
    }

    @GetMapping("/submission")
    public ResponseEntity<List<PhotoSubmission>> getAllPhotoSubmissions() {
        List<PhotoSubmission> submissions = photoSubmissionService.getAllPhotoSubmissions();
        return ResponseEntity.ok(submissions);
    }
    @GetMapping("/contest/{contestId}/submissions")
    public ResponseEntity<List<PhotoSubmission>> getSubmissionsByContestId(@PathVariable Long contestId) {
        List<PhotoSubmission> submissions = photoSubmissionService.getSubmissionsByContestId(contestId);
        return ResponseEntity.ok(submissions);
    }


    @PutMapping("/submission/{id}")
    public ResponseEntity<PhotoSubmission> updatePhotoSubmission(
            @PathVariable Long id,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam("data") String data) throws IOException {


        PhotoSubmissionDTO photoSubmissionDTO = objectMapper.readValue(data, PhotoSubmissionDTO.class);

        PhotoSubmission updatedSubmission = photoSubmissionService.updatePhotoSubmission(id, photoSubmissionDTO, file);
        return ResponseEntity.ok(updatedSubmission);
    }

    @DeleteMapping("/submission/{id}")
    public ResponseEntity<Void> deletePhotoSubmission(@PathVariable Long id) {
        photoSubmissionService.deletePhotoSubmission(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/jury/submissions")
    public ResponseEntity<List<ContestPhotoDTO>> getSubmissionsByJuryMemberId() {
        List<ContestPhotoDTO> submissions = photoSubmissionService.getSubmissionsByJuryMemberId();
        return ResponseEntity.ok(submissions);
    }
}
