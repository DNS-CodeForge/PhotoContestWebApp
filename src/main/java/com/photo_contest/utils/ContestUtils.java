package com.photo_contest.utils;

import com.photo_contest.models.DTO.RankedUserResponseDTO;
import com.photo_contest.repos.PhotoSubmissionRepository;
import com.photo_contest.services.contracts.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
@Component
public class ContestUtils {
    private final PhotoSubmissionRepository photoSubmissionRepository;
    private final UserService userService;
    @Autowired
    public ContestUtils(PhotoSubmissionRepository photoSubmissionRepository, UserService userService) {
        this.photoSubmissionRepository = photoSubmissionRepository;
        this.userService = userService;
    }
    public List<RankedUserResponseDTO> awardPointsForContest(Long contestId) {

        List<RankedUserResponseDTO> finalScores = photoSubmissionRepository.getFinalScoresByContestId(contestId);
        awardPoints(finalScores, userService);
        return finalScores;
    }

    private void awardPoints(List<RankedUserResponseDTO> rankedUsers, UserService userService) {

        if (rankedUsers.isEmpty()) {
            return;
        }

        int rank = 1;

        for (int i = 0; i < rankedUsers.size(); i++) {
            RankedUserResponseDTO current = rankedUsers.get(i);
            int awardedPoints = calculatePointsForRank(current, rankedUsers, rank);

            int lastIndex = i;
            for (int j = i + 1; j < rankedUsers.size(); j++) {
                RankedUserResponseDTO next = rankedUsers.get(j);

                if (current.getPoints() == next.getPoints()) {
                    awardedPoints = calculateTiedPoints(awardedPoints);
                    userService.addPoints(next.getUserId().intValue(), awardedPoints);
                    lastIndex = j;
                } else {
                    break;
                }
            }

            userService.addPoints(current.getUserId().intValue(), awardedPoints);
            i = lastIndex;

            rank++;
        }
    }

    private int calculatePointsForRank(RankedUserResponseDTO current, List<RankedUserResponseDTO> rankedUsers, int rank) {
        if (rank == 1) {
            return calculateFirstPlacePoints(current, rankedUsers);
        } else if (rank == 2) {
            return 35;
        } else if (rank == 3) {
            return 20;
        } else {
            return 0;
        }
    }

    private int calculateFirstPlacePoints(RankedUserResponseDTO current, List<RankedUserResponseDTO> rankedUsers) {
        if (rankedUsers.size() > 1 && current.getPoints() >= 2 * rankedUsers.get(1).getPoints()) {
            return 75;
        } else {
            return 50;
        }
    }

    private static int calculateTiedPoints(int awardedPoints) {
        switch (awardedPoints) {
            case 50:
                return 40;
            case 35:
                return 25;
            case 20:
                return 10;
            default:
                return awardedPoints;
        }
    }
}



