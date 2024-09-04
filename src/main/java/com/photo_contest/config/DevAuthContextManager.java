package com.photo_contest.config;

import com.photo_contest.models.UserProfile;
import com.photo_contest.repos.UserProfileRepository;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import static com.photo_contest.constants.ModelValidationConstants.INVALID_ID;

@Configuration
@Profile("dev")
public class DevAuthContextManager extends AuthContextManager {

    public DevAuthContextManager(UserProfileRepository userRepository) {
        super(userRepository);
    }

    @Override
    public UserProfile getLoggedInUser() {

        return userRepository.findById(1L)
                .orElseThrow(() -> new EntityNotFoundException(INVALID_ID.formatted("User", 1L)));
    }

    @Override
    public Long getId() {
        return 1L;
    }

    @Override
    public String getFirstName() {
        UserProfile user = userRepository.findById(1l).get();
        return user.getFirstName();
    }

    @Override
    public String getLastName() {
        UserProfile user = userRepository.findById(1l).get();
        return user.getLastName();
    }

    @Override
    public String getEmail() {
        UserProfile user = userRepository.findById(1l).get();
        return user.getAppUser().getEmail();
    }

    @Override
    public String getUsername() {
        UserProfile user = userRepository.findById(1l).get();
        return user.getAppUser().getUsername();
    }
}
