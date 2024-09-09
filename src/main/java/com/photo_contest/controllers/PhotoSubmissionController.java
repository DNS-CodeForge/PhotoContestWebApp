package com.photo_contest.controllers;

import java.util.List;

import com.photo_contest.models.PhotoSubmission;
import com.photo_contest.models.DTO.PhotoSubmissionDTO;
import com.photo_contest.services.contracts.PhotoSubmissionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class PhotoSubmissionController {

    private final PhotoSubmissionService photoSubmissionService;

    @Autowired
    public PhotoSubmissionController(PhotoSubmissionService photoSubmissionService) {
        this.photoSubmissionService = photoSubmissionService;
    }

    @PostMapping("/contest/{contestId}/submission")
    public ResponseEntity<PhotoSubmission> createPhotoSubmission(@PathVariable Long contestId, @RequestBody PhotoSubmissionDTO photoSubmission) {
        PhotoSubmission createdSubmission = photoSubmissionService.createPhotoSubmission(contestId, photoSubmission);
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

    @PutMapping("/submission/{id}")
    public ResponseEntity<PhotoSubmission> updatePhotoSubmission(@PathVariable Long id, @RequestBody PhotoSubmissionDTO photoSubmission) {
        PhotoSubmission updatedSubmission = photoSubmissionService.updatePhotoSubmission(id, photoSubmission);
        return ResponseEntity.ok(updatedSubmission);
    }

    @DeleteMapping("/submission/{id}")
    public ResponseEntity<Void> deletePhotoSubmission(@PathVariable Long id) {
        photoSubmissionService.deletePhotoSubmission(id);
        return ResponseEntity.noContent().build();
    }
}
