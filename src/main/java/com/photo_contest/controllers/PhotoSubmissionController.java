package com.photo_contest.controllers;

import java.util.List;

import com.photo_contest.models.PhotoSubmission;
import com.photo_contest.models.DTO.PhotoSubmissionDTO;
import com.photo_contest.services.contracts.PhotoSubmissionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
        return new ResponseEntity<>(createdSubmission, HttpStatus.CREATED);
    }

    @GetMapping("/submission/{id}")
    public ResponseEntity<PhotoSubmission> getPhotoSubmissionById(@PathVariable Long id) {
        PhotoSubmission submission = photoSubmissionService.getPhotoSubmissionById(id);
        return new ResponseEntity<>(submission, HttpStatus.OK);
    }

    @GetMapping("/submission")
    public ResponseEntity<List<PhotoSubmission>> getAllPhotoSubmissions() {
        List<PhotoSubmission> submissions = photoSubmissionService.getAllPhotoSubmissions();
        return new ResponseEntity<>(submissions, HttpStatus.OK);
    }

    @PutMapping("/submission/{id}")
    public ResponseEntity<PhotoSubmission> updatePhotoSubmission(@PathVariable Long id, @RequestBody PhotoSubmissionDTO photoSubmission) {
        PhotoSubmission updatedSubmission = photoSubmissionService.updatePhotoSubmission(id, photoSubmission);
        return new ResponseEntity<>(updatedSubmission, HttpStatus.OK);
    }

    @DeleteMapping("/submission/{id}")
    public ResponseEntity<Void> deletePhotoSubmission(@PathVariable Long id) {
        photoSubmissionService.deletePhotoSubmission(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
