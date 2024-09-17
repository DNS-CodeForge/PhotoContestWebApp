package com.photo_contest.repos;

import java.util.List;
import java.util.Optional;

import com.photo_contest.models.AppUser;

import com.photo_contest.models.DTO.UserAppProfileDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<AppUser, Long>{
    Optional<AppUser> findByUsername(String username);

    @Query("SELECT new com.photo_contest.models.DTO.UserAppProfileDTO(u.id, u.username, u.email, p.firstName, p.lastName, r.authority, " +
            "CASE WHEN p.rank = 'JUNKIE' THEN 'JUNKIE' " +
            "WHEN p.rank = 'ENTHUSIAST' THEN 'ENTHUSIAST' " +
            "WHEN p.rank = 'MASTER' THEN 'MASTER' " +
            "WHEN p.rank = 'DICTATOR' THEN 'DICTATOR' " +
            "WHEN p.rank = 'ORGANIZER' THEN 'ORGANIZER' ELSE 'UNKNOWN' END) " +
            "FROM AppUser u " +
            "JOIN UserProfile p ON u.id = p.id " +
            "JOIN u.roles r " +
            "WHERE u.username LIKE %:username% " +
            "AND (r.authority = 'MASTERUSER' OR r.authority = 'ADMIN') " +
            "AND u.id NOT IN (SELECT participant.id FROM Contest c JOIN c.participants participant WHERE c.id = :contestId) " +
            "AND u.id NOT IN (SELECT jury.id FROM Contest c JOIN c.jury jury WHERE c.id = :contestId) " +
            "ORDER BY u.username ASC")
    List<UserAppProfileDTO> findTop5ByUsernameContainingAndNotInContest(@Param("username") String username, @Param("contestId") Long contestId);



}


