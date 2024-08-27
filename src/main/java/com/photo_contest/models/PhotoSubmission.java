package com.photo_contest.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.List;

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

    @NotBlank(message = "Title is mandatory")
    @Size(max = 255, message = "Title must be less than 255 characters")
    @Column(nullable = false)
    private String title;

    @NotBlank(message = "Story is mandatory")
    @Size(max = 5000, message = "Story must be less than 5000 characters")
    @Column(nullable = false, length = 5000)
    private String story;

    @NotBlank(message = "Photo URL is mandatory")
    @Column(nullable = false)
    private String photoUrl;

    @ManyToOne
    @JoinColumn(name = "contest_id", nullable = false)
    @JsonBackReference
    private Contest contest;

    @OneToMany(mappedBy = "photoSubmission", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<PhotoReview> photoReviews;
}
