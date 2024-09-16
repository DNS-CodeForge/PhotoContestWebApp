package com.photo_contest.services.contracts;

import java.util.List;

import com.photo_contest.models.AppUser;
import com.photo_contest.models.Contest;
import com.photo_contest.models.UserProfile;
import com.photo_contest.models.DTO.EditProfileDTO;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

public interface UserService extends UserDetailsService {
    @Override
    UserDetails loadUserByUsername(String username) throws UsernameNotFoundException;

    UserProfile getUserById(int id);

    UserProfile getUserByUsername(String name);

    UserProfile updateUserProfile(EditProfileDTO editProfileDTO);

    List<UserProfile> getAllUsers();

    void deleteUser(int id);

    AppUser setUserRole(int userId, String addedRole, String removedRole);

    void addPoints(int userId, int pointsToAdd);

    public List<Contest> getAllContestsByUserProfileId(Long userProfileId);
}
