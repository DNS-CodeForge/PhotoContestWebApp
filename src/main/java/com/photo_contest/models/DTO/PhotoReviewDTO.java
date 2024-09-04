package com.photo_contest.models.DTO;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import static com.photo_contest.constants.ModelValidationConstants.*;

@Data
public class PhotoReviewDTO {

    @Min(value = 1, message = PR_SCR_MIN_MSG)
    @Max(value = 10, message = PR_SCR_MAX_MSG)
    private int score = PR_DEFAULT_SCR;

    @NotBlank(message = PR_COMMENT_MANDATORY_MSG)
    @Size(max = PR_COMMENT_MAX_SIZE, message = PR_COMMENT_SIZE_MSG)
    private String comment;

    private boolean categoryMismatch = false;
}
