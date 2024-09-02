package com.photo_contest.models.DTO;

import com.photo_contest.models.Contest.Category;
import lombok.Data;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;

@Data
public class CreateContestDTO {

    @NotBlank(message = "Title is required.")
    @Size(min = 6, max = 26, message = "Title must be between 6 and 26 characters.")
    private String title;

    @NotNull(message = "Category is required.")
    private Category category;

    @Min(value = 1, message = "Phase duration must be at least 1 day.")
    @Max(value = 30, message = "Phase duration cannot exceed 30 days.")
    private int phaseDurationInDays;

    @Min(value = 1, message = "Phase 2 duration must be at least 1 hour.")
    @Max(value = 24, message = "Phase 2 duration cannot exceed 24 hours.")
    private int phaseTwoDurationInHours;

    private boolean isPrivate;
}
