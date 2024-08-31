package com.photo_contest.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PhotoReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Min(value = 1, message = "Score must be at least 1")
    @Max(value = 10, message = "Score must be at most 10")
    @Column(nullable = false)
    private int score = 3;

    @NotBlank(message = "Comment is mandatory")
    @Size(max = 5000, message = "Comment must be less than 5000 characters")
    @Column(nullable = false, length = 5000)
    private String comment;

    @Column(nullable = false)
    private boolean categoryMismatch = false;

    @ManyToOne
    @JoinColumn(name = "jury_id", nullable = false)
    private UserProfile jury;

    @ManyToOne
    @JoinColumn(name = "photo_submission_id", nullable = false)
    @JsonManagedReference
    private PhotoSubmission photoSubmission;

    @Column(nullable = false)
    private boolean isReviewed = false;
}
