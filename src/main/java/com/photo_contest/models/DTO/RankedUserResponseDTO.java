package com.photo_contest.models.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RankedUserResponseDTO {
    private Long userId;
    private Long submissionId;
    private int points;
}

