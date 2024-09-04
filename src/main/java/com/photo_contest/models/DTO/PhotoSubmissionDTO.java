package com.photo_contest.models.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import lombok.Data;

import static com.photo_contest.constants.ModelValidationConstants.*;


@Data
public class PhotoSubmissionDTO {

    @NotBlank(message = PS_TITLE_MANDATORY_MSG)
    @Size(max = PS_TITLE_MAX_SIZE, message = PS_TITLE_SIZE_MSG)
    private String title;

    @NotBlank(message = PS_STORY_MANDATORY_MSG)
    @Size(max = PS_STORY_MAX_SIZE, message = PS_STORY_SIZE_MSG)
    private String story;

    @NotBlank(message = PS_PHOTO_URL_MANDATORY_MSG)
    private String photoUrl;
}
