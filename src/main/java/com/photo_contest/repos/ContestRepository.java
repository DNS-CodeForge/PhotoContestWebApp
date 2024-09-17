package com.photo_contest.repos;

import com.photo_contest.models.Contest;

import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContestRepository extends JpaRepository<Contest, Long>, JpaSpecificationExecutor<Contest> {
     Optional<Contest> findByTitle(String title);


    @Query("SELECT c FROM Contest c JOIN c.participants p WHERE p.id = :userProfileId")
    List<Contest> findAllContestsByUserProfileId(Long userProfileId);
    List<Contest> findAllByOrganizerId(Long organizerId);
    Page<Contest> findByOrganizerId(Long organizerId, Pageable pageable);


    @Transactional
    @Modifying
    @Query("DELETE FROM Contest c WHERE c.id = ?1")
    void deleteById(Long id);
}
