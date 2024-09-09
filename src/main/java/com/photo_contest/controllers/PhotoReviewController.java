package com.photo_contest.controllers;

import java.util.List;

import com.photo_contest.models.PhotoReview;
import com.photo_contest.models.DTO.PhotoReviewDTO;
import com.photo_contest.services.contracts.PhotoReviewService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class PhotoReviewController {

    private final PhotoReviewService photoReviewService;

    @Autowired
    public PhotoReviewController(PhotoReviewService photoReviewService) {
        this.photoReviewService = photoReviewService;
    }

    @PostMapping("/submission/{submissionId}/review")
    public ResponseEntity<PhotoReview> createPhotoReview(@RequestBody PhotoReviewDTO photoReviewDTO,
                                                         @PathVariable Long submissionId) {
        PhotoReview newPhotoReview = photoReviewService.createPhotoReview(photoReviewDTO, submissionId);
        return ResponseEntity.status(201).body(newPhotoReview);
    }

    @GetMapping("/review/{id}")
    public ResponseEntity<PhotoReview> getPhotoReviewById(@PathVariable Long id) {
        return photoReviewService.getPhotoReviewById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(404).build());
    }

    @GetMapping("/review")
    public ResponseEntity<List<PhotoReview>> getAllPhotoReviews() {
        List<PhotoReview> reviews = photoReviewService.getAllPhotoReviews();
        return ResponseEntity.ok(reviews);
    }

    @PutMapping("/review/{id}")
    public ResponseEntity<PhotoReview> updatePhotoReview(@PathVariable Long id, @RequestBody PhotoReviewDTO photoReviewDTO) {
        PhotoReview updatedPhotoReview = photoReviewService.updatePhotoReview(id, photoReviewDTO);
        return ResponseEntity.ok(updatedPhotoReview);
    }


@DeleteMapping("/review/{id}")
    public ResponseEntity<Void> deletePhotoReview(@PathVariable Long id) {
        if (photoReviewService.getPhotoReviewById(id).isPresent()) {
            photoReviewService.deletePhotoReview(id);

            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
