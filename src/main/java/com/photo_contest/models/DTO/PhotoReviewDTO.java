package com.photo_contest.models.DTO;

import lombok.Data;

@Data
public class PhotoReviewDTO {

    private int score = 3;

    private String comment;

    private boolean categoryMismatch = false;
}
