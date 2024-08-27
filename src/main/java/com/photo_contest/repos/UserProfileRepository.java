package com.photo_contest.repos;

import com.photo_contest.models.UserProfile;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {

    @Query("SELECT up FROM UserProfile up WHERE up.appUser.username = :username")
    Optional<UserProfile> findByUsername(@Param("username") String username);
}

