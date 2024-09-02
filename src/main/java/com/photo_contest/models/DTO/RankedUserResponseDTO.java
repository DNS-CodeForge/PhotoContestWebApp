package com.photo_contest.models.DTO;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class RankedUserResponseDTO {

    public RankedUserResponseDTO(Long userId, Long submissionId, Long points) {
        this.userId = userId;
        this.submissionId = submissionId;
        this.points = points;
    }

    private Long userId;

    private Long submissionId;

    private Long points;
}
