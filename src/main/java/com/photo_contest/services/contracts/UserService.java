package com.photo_contest.services.contracts;

import java.util.List;

import com.photo_contest.models.AppUser;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

public interface UserService extends UserDetailsService{
    @Override
    UserDetails loadUserByUsername(String username) throws UsernameNotFoundException;

    AppUser getUserById(int id);

    AppUser getUserByName(String name);

    List<AppUser> getAllUsers();

    void deleteUser(int id);

    AppUser setUserRole(int userId, String addedRole, String removedRole);

    void addPoints(int userId, int pointsToAdd); 
}
