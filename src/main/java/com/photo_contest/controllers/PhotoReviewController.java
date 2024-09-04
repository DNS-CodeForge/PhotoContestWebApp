package com.photo_contest.controllers;

import java.util.List;

import com.photo_contest.models.PhotoReview;
import com.photo_contest.models.DTO.PhotoReviewDTO;
import com.photo_contest.services.contracts.PhotoReviewService;

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
        return new ResponseEntity<>(newPhotoReview, HttpStatus.CREATED);
    }

    @GetMapping("/review/{id}")
    public ResponseEntity<PhotoReview> getPhotoReviewById(@PathVariable Long id) {
        return photoReviewService.getPhotoReviewById(id)
                .map(photoReview -> new ResponseEntity<>(photoReview, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/review")
    public ResponseEntity<List<PhotoReview>> getAllPhotoReviews() {
        List<PhotoReview> reviews = photoReviewService.getAllPhotoReviews();
        return new ResponseEntity<>(reviews, HttpStatus.OK);
    }

    @PutMapping("/review/{id}")
    public ResponseEntity<PhotoReview> updatePhotoReview(@PathVariable Long id, @RequestBody PhotoReviewDTO photoReviewDTO) {
        PhotoReview updatedPhotoReview = photoReviewService.updatePhotoReview(id, photoReviewDTO);
        return new ResponseEntity<>(updatedPhotoReview, HttpStatus.OK);
    }

    @DeleteMapping("/review/{id}")
    public ResponseEntity<Void> deletePhotoReview(@PathVariable Long id) {
        if (photoReviewService.getPhotoReviewById(id).isPresent()) {
            photoReviewService.deletePhotoReview(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
