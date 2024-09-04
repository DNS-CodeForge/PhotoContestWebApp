package com.photo_contest.config;


import com.photo_contest.models.UserProfile;
import com.photo_contest.repos.UserProfileRepository;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.context.annotation.Profile;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import static com.photo_contest.constants.ModelValidationConstants.INVALID_USERNAME;

@Component
@Profile("prod")
public class AuthContextManager {
    protected final UserProfileRepository userRepository;

    public AuthContextManager(UserProfileRepository userRepository) {
        this.userRepository = userRepository;
    }


    public UserProfile getLoggedInUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        return userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException(INVALID_USERNAME.formatted(username)));

    }

    public Long getId() {
        UserProfile user = getLoggedInUser();
        return user != null ? user.getId() : null;
    }

    public String getFirstName() {
        UserProfile user = getLoggedInUser();
        return user.getFirstName();
    }

    public String getLastName() {
        UserProfile user = getLoggedInUser();
        return  user.getLastName();
    }

    public String getEmail() {
        UserProfile user = getLoggedInUser();
        return user.getAppUser().getEmail();
    }

    public String getUsername() {
        UserProfile user = getLoggedInUser();
        return user.getAppUser().getUsername();
    }
}
