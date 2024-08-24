package com.photo_contest.repos;

import com.photo_contest.models.AppUser;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<Long,AppUser>{
}
