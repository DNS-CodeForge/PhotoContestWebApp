package com.photo_contest.models;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonBackReference;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import static com.photo_contest.constants.ModelValidationConstants.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PhotoSubmission {



    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "creator_id", nullable = false)
    private UserProfile creator;

    @NotBlank(message = PS_TITLE_MANDATORY_MSG)
    @Size(max = PS_TITLE_MAX_SIZE, message = PS_TITLE_SIZE_MSG)
    @Column(nullable = false)
    private String title;

    @NotBlank(message = PS_STORY_MANDATORY_MSG)
    @Size(max = PS_STORY_MAX_SIZE, message = PS_STORY_SIZE_MSG)
    @Column(nullable = false, length = PS_STORY_MAX_SIZE)
    private String story;

    @NotBlank(message = PS_PHOTO_URL_MANDATORY_MSG)
    @Column(nullable = false)
    private String photoUrl;

    @ManyToOne
    @JoinColumn(name = "contest_id", nullable = false)
    @JsonBackReference
    private Contest contest;

    @OneToMany(mappedBy = "photoSubmission", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<PhotoReview> photoReviews;
}
