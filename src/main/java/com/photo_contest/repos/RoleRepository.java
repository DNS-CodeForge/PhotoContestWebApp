package com.photo_contest.repos;

import java.util.Optional;

import com.photo_contest.models.Role;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByAuthority(String authority);
}
