package com.photo_contest.config;


import com.photo_contest.models.UserProfile;
import com.photo_contest.repos.UserProfileRepository;

import org.springframework.context.annotation.Profile;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@Profile("prod")
public class AuthContextManager {
    protected final UserProfileRepository userRepository;

    public AuthContextManager(UserProfileRepository userRepository) {
        this.userRepository = userRepository;
    }


    public UserProfile getLoggedInUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        return userRepository.findByUsername(username).orElse(null);
    }

    public Long getId() {
        UserProfile user = getLoggedInUser();
        return user != null ? user.getId() : null;
    }

    public String getFirstName() {
        UserProfile user = getLoggedInUser();
        return user != null ? user.getFirstName() : null;
    }

    public String getLastName() {
        UserProfile user = getLoggedInUser();
        return user != null ? user.getLastName() : null;
    }

    public String getEmail() {
        UserProfile user = getLoggedInUser();
        return user != null ? user.getAppUser().getEmail() : null;
    }

    public String getUsername() {
        UserProfile user = getLoggedInUser();
        return user != null ? user.getAppUser().getUsername() : null;
    }
}
