package com.photo_contest.config;

import com.photo_contest.models.UserProfile;
import com.photo_contest.repos.UserProfileRepository;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
@Profile("dev")
public class DevAuthContextManager extends AuthContextManager{

    public DevAuthContextManager(UserProfileRepository userRepository) {
        super(userRepository);
    }

    @Override
    public UserProfile getLoggedInUser() {
        return userRepository.findById(1l).orElse(null);
    }

    @Override
    public Long getId() {
        return 1L;
    }

    @Override
    public String getFirstName() {
        UserProfile user = userRepository.findById(1l).get();
        return user != null ? user.getFirstName() : null;
    }

    @Override
    public String getLastName() {
        UserProfile user = userRepository.findById(1l).get();
        return user != null ? user.getLastName() : null;
    }

    @Override
    public String getEmail() {
        UserProfile user = userRepository.findById(1l).get();
        return user != null ? user.getAppUser().getEmail() : null;
    }

    @Override
    public String getUsername() {
        UserProfile user = userRepository.findById(1l).get();
        return user != null ? user.getAppUser().getUsername() : null;
    }
}
