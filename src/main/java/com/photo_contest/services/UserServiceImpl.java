package com.photo_contest.services;

import java.util.List;

import com.photo_contest.models.AppUser;
import com.photo_contest.models.Role;
import com.photo_contest.repos.UserRepository;
import com.photo_contest.services.contracts.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
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
}
