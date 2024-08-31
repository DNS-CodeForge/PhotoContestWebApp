package com.photo_contest.controllers;

import java.util.List;

import com.photo_contest.models.PhotoReview;
import com.photo_contest.models.DTO.PhotoReviewDTO;
import com.photo_contest.services.contracts.PhotoReviewService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/photo-reviews")
public class PhotoReviewController {

    private final PhotoReviewService photoReviewService;

    @Autowired
    public PhotoReviewController(PhotoReviewService photoReviewService) {
        this.photoReviewService = photoReviewService;
    }

    @PostMapping
    public PhotoReview createPhotoReview(@RequestBody PhotoReviewDTO photoReviewDTO,
                                         @RequestParam Long photoSubmissionId) {
        return photoReviewService.createPhotoReview(photoReviewDTO, photoSubmissionId);
    }

    @GetMapping("/{id}")
    public PhotoReview getPhotoReviewById(@PathVariable Long id) {
        return photoReviewService.getPhotoReviewById(id)
                .orElseThrow(() -> new RuntimeException("PhotoReview not found"));
    }

    @GetMapping
    public List<PhotoReview> getAllPhotoReviews() {
        return photoReviewService.getAllPhotoReviews();
    }

    @PutMapping("/{id}")
    public PhotoReview updatePhotoReview(@PathVariable Long id, @RequestBody PhotoReviewDTO photoReviewDTO) {
        return photoReviewService.updatePhotoReview(id, photoReviewDTO);
    }

    @DeleteMapping("/{id}")
    public void deletePhotoReview(@PathVariable Long id) {
        photoReviewService.deletePhotoReview(id);
    }
}
