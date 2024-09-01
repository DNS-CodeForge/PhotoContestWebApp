package com.photo_contest.models.DTO;

import com.photo_contest.models.Contest.Category;
import lombok.Data;

@Data
public class CreateContestDTO {
    private String title;
    private Category category;
    private int phaseDurationInDays;
    private boolean isPrivate;
}
