package com.photo_contest.repos;

import com.photo_contest.models.PhotoReview;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PhotoReviewRepository extends JpaRepository<Long,PhotoReview>{
}
