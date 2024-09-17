package com.photo_contest.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
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
import lombok.ToString;

import static com.photo_contest.constants.ModelValidationConstants.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PhotoReview {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Min(value = 1, message = PR_SCR_MIN_MSG)
    @Max(value = 10, message = PR_SCR_MAX_MSG)
    @Column(nullable = false)
    private int score = PR_DEFAULT_SCR;

    @NotBlank(message = PR_COMMENT_MANDATORY_MSG)
    @Size(max = PR_COMMENT_MAX_SIZE, message = PR_COMMENT_SIZE_MSG)
    @Column(nullable = false, length = PR_COMMENT_MAX_SIZE)
    private String comment;

    @Column(nullable = false)
    private boolean categoryMismatch = false;

    @ManyToOne
    @JoinColumn(name = "jury_id", nullable = false)
    private UserProfile jury;

    @ManyToOne
    @JoinColumn(name = "photo_submission_id", nullable = false)
    @JsonBackReference
    @ToString.Exclude
    private PhotoSubmission photoSubmission;

    @Column(nullable = false)
    private boolean isReviewed = false;
}
