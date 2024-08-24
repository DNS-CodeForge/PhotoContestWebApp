package com.photo_contest.repos;

import com.photo_contest.models.PhotoSubmission;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PhotoSubmissionRepository extends JpaRepository<Long,PhotoSubmission>{
}
