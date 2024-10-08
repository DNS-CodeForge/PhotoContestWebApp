package com.photo_contest.models.DTO;

import static com.photo_contest.constants.ModelValidationConstants.CATEGORY_REQUIRED;
import static com.photo_contest.constants.ModelValidationConstants.PHASE_DURATION_MAX;
import static com.photo_contest.constants.ModelValidationConstants.PHASE_DURATION_MIN;
import static com.photo_contest.constants.ModelValidationConstants.PHASE_TWO_DURATION_MAX;
import static com.photo_contest.constants.ModelValidationConstants.PHASE_TWO_DURATION_MIN;
import static com.photo_contest.constants.ModelValidationConstants.TITLE_REQUIRED;
import static com.photo_contest.constants.ModelValidationConstants.TITLE_SIZE;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.photo_contest.models.Contest.Category;

import lombok.Data;

@Data

@JsonIgnoreProperties(ignoreUnknown = true)
public class CreateContestDTO {

    @NotBlank(message = TITLE_REQUIRED)
    @Size(min = 6, max = 50, message = TITLE_SIZE)
    private String title;

    @NotNull(message = CATEGORY_REQUIRED)
    private Category category;

    @Min(value = 1, message = PHASE_DURATION_MIN)
    @Max(value = 30, message = PHASE_DURATION_MAX)
    private int phaseDurationInDays;

    @Min(value = 1, message = PHASE_TWO_DURATION_MIN)
    @Max(value = 24, message = PHASE_TWO_DURATION_MAX)
    private int phaseTwoDurationInHours;

    private boolean isPrivate;
}
