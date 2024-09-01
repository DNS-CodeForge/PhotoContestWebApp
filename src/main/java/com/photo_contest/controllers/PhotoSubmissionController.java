package com.photo_contest.controllers;

import java.util.List;

import com.photo_contest.models.PhotoSubmission;
import com.photo_contest.models.DTO.PhotoSubmissionDTO;
import com.photo_contest.services.contracts.PhotoSubmissionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/photo-submission")
public class PhotoSubmissionController {

    private final PhotoSubmissionService photoSubmissionService;

    @Autowired
    public PhotoSubmissionController(PhotoSubmissionService photoSubmissionService) {
        this.photoSubmissionService = photoSubmissionService;
    }

    @PostMapping
    public PhotoSubmission createPhotoSubmission(@RequestBody PhotoSubmissionDTO photoSubmission) {
        return photoSubmissionService.createPhotoSubmission(photoSubmission);
    }

    @GetMapping("/{id}")
    public PhotoSubmission getPhotoSubmissionById(@PathVariable Long id) {
        return photoSubmissionService.getPhotoSubmissionById(id);
    }

    @GetMapping
    public List<PhotoSubmission> getAllPhotoSubmissions() {
        return photoSubmissionService.getAllPhotoSubmissions();
    }

    @PutMapping("/{id}")
    public PhotoSubmission updatePhotoSubmission(@PathVariable Long id, @RequestBody PhotoSubmissionDTO photoSubmission) {
        return photoSubmissionService.updatePhotoSubmission(id, photoSubmission);
    }

    @DeleteMapping("/{id}")
    public void deletePhotoSubmission(@PathVariable Long id) {
        photoSubmissionService.deletePhotoSubmission(id);
    }
}
