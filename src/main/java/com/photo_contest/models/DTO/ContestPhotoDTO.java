package com.photo_contest.models.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class ContestPhotoDTO {


    private Long id;
    private String title;
    private String story;
    private String photoUrl;
    private Long contestId;
    private List<Long> reviewedByJuryIds;
    private boolean isActive;
}
