package com.photo_contest.services;

import java.util.List;

import com.photo_contest.models.AppUser;
import com.photo_contest.models.Contest;
import com.photo_contest.models.Role;
import com.photo_contest.models.UserProfile;
import com.photo_contest.repos.ContestRepository;
import com.photo_contest.repos.RoleRepository;
import com.photo_contest.repos.UserProfileRepository;
import com.photo_contest.repos.UserRepository;
import com.photo_contest.services.contracts.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final RoleRepository roleRepository;
    private final ContestRepository contestRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, UserProfileRepository userProfileRepository, RoleRepository roleRepository, ContestRepository contestRepository) {
        this.userRepository = userRepository;
        this.userProfileRepository = userProfileRepository;
        this.roleRepository = roleRepository;
        this.contestRepository = contestRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
    }

    @Override
    public AppUser getUserById(int id) {
        return userRepository.findById((long) id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with ID: " + id));
    }

    @Override
    public AppUser getUserByName(String name) {
        return userRepository.findByUsername(name)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with name: " + name));
    }

    @Override
    public UserProfile updateUserProfile(UserProfile userProfile) {
        return userProfileRepository.save(userProfile);
    }

    @Override
    public List<AppUser> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public void deleteUser(int id) {
        if (userRepository.existsById((long) id)) {
            userRepository.deleteById((long) id);
        } else {
            throw new UsernameNotFoundException("User not found with ID: " + id);
        }
    }

    @Override
    public AppUser setUserRole(int userId, String addedRole, String removedRole) {
        AppUser user = userRepository.findById((long) userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with ID: " + userId));

        if (addedRole != null) {
            user.getRoles().add(new Role(addedRole));
        }
        if (removedRole != null) {
            user.getRoles().remove(new Role(removedRole));
        }

        return userRepository.save(user);
    }


    @Override
    public void addPoints(int userId, int pointsToAdd) {
        AppUser user = userRepository.findById((long) userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with ID: " + userId));

        if (user.getUserProfile().getRank().equals(UserProfile.Rank.ORGANIZER)) {
            return;
        }
        UserProfile userProfile = user.getUserProfile();
        userProfile.setPoints(userProfile.getPoints() + pointsToAdd);

        if (user.getUserProfile().getRank() != UserProfile.Rank.DICTATOR &&
                user.getUserProfile().getRank() != UserProfile.Rank.ORGANIZER
        ) {
            updateRank(userProfile);
        }

        userRepository.save(user);
    }

    private void updateRank(UserProfile userProfile) {
        int points = userProfile.getPoints();

        if (points >= 1001) {
            userProfile.setRank(UserProfile.Rank.DICTATOR);
        } else if (points >= 151) {
            userProfile.setRank(UserProfile.Rank.MASTER);
            userProfile.getAppUser().getAuthoritySet().add(roleRepository.findByAuthority("MASTERUSER").get());
            userProfileRepository.save(userProfile);
        } else if (points >= 51) {
            userProfile.setRank(UserProfile.Rank.ENTHUSIAST);
        } else {
            userProfile.setRank(UserProfile.Rank.JUNKIE);
        }
    }

    public List<Contest> getAllContestsByUserProfileId(Long userProfileId) {
        return contestRepository.findAllContestsByUserProfileId(userProfileId);
    }
}

