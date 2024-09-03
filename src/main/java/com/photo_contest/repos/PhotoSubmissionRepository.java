package com.photo_contest.repos;

import java.util.List;

import com.photo_contest.models.DTO.RankedUserResponseDTO;
import com.photo_contest.models.PhotoSubmission;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PhotoSubmissionRepository extends JpaRepository<PhotoSubmission, Long>{
    @Query("SELECT new com.photo_contest.models.DTO.RankedUserResponseDTO(ps.creator.id, ps.id, COALESCE(SUM(pr.score), 0)) " +
           "FROM PhotoSubmission ps " +
           "LEFT JOIN ps.photoReviews pr " +
           "WHERE ps.contest.id = :contestId " +
           "GROUP BY ps.creator.id, ps.id " +
           "ORDER BY COALESCE(SUM(pr.score), 0) DESC")
    List<RankedUserResponseDTO> getRankingsByContestId(@Param("contestId") Long contestId);
}
