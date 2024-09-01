package com.photo_contest.repos;

import com.photo_contest.models.Contest;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ContestRepository extends JpaRepository<Contest,Long>{
    public Optional<Contest> findByTitle(String title);
}
