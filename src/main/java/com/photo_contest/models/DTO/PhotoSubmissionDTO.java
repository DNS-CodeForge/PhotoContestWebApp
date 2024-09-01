package com.photo_contest.models.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import lombok.Data;

@Data
public class PhotoSubmissionDTO {

    @NotBlank(message = "Title is mandatory")
    @Size(max = 255, message = "Title must be less than 255 characters")
    private String title;

    @NotBlank(message = "Story is mandatory")
    @Size(max = 5000, message = "Story must be less than 5000 characters")
    private String story;

    @NotBlank(message = "Photo URL is mandatory")
    private String photoUrl;

    private Long contestId;
}
