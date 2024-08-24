package com.photo_contest.services;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.EntityNotFoundException;

import com.photo_contest.models.AppUser;
import com.photo_contest.models.Role;
import com.photo_contest.models.DTO.RegistrationDTO;
import com.photo_contest.repos.RoleRepository;
import com.photo_contest.repos.UserRepository;
import com.photo_contest.services.contracts.AuthService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService{

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;

    @Autowired
    public AuthServiceImpl(RoleRepository roleRepository, UserRepository userRepository){
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
    }


    @Override
    public AppUser registerUser(RegistrationDTO registrationDTO) {
        AppUser user = new AppUser();
        user.setEmail(registrationDTO.getEmail());
        user.setUsername(registrationDTO.getUsername());
        user.setPassword(registrationDTO.getPassword());

        Role userRole = roleRepository.findByAuthority("USER")
                .orElseThrow(() -> new EntityNotFoundException("Role not found"));

        Set<Role> roles = new HashSet<>();
        roles.add(userRole);
        user.setRoles(roles);

        return userRepository.save(user);
     }
}
