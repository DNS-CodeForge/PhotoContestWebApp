package com.photo_contest.repos;

import java.util.List;


import com.photo_contest.models.DTO.RankedUserResponseDTO;
import com.photo_contest.models.PhotoSubmission;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PhotoSubmissionRepository extends JpaRepository<PhotoSubmission, Long> {
    @Query("SELECT new com.photo_contest.models.DTO.RankedUserResponseDTO(ps.creator.id, ps.creator.appUser.username ,ps.id, CAST(COALESCE(SUM(pr.score), 0) AS int)) " +
            "FROM PhotoSubmission ps " +
            "LEFT JOIN ps.photoReviews pr " +
            "WHERE ps.contest.id = :contestId " +
            "GROUP BY ps.creator.id,ps.creator.appUser.username, ps.id " +
            "ORDER BY COALESCE(SUM(pr.score), 0) DESC")
    List<RankedUserResponseDTO> getRankingsByContestId(@Param("contestId") Long contestId);

    @Query("SELECT new com.photo_contest.models.DTO.RankedUserResponseDTO(ps.creator.id, ps.creator.appUser.username , ps.id, " +
            "CAST(COALESCE(SUM(pr.score), 0) + ((COUNT(j) - COUNT(pr.id)) * 3) AS int)) " +
            "FROM PhotoSubmission ps " +
            "LEFT JOIN ps.photoReviews pr " +
            "JOIN ps.contest c " +
            "JOIN c.jury j " +
            "WHERE ps.contest.id = :contestId " +
            "GROUP BY ps.creator.id,ps.creator.appUser.username, ps.id " +
            "ORDER BY COALESCE(SUM(pr.score), 0) + ((COUNT(j) - COUNT(pr.id)) * 3) DESC")
    List<RankedUserResponseDTO> getFinalScoresByContestId(@Param("contestId") Long contestId);


    List<PhotoSubmission> findByContestId(Long contestId);

}
