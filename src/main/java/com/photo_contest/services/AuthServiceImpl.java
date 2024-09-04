package com.photo_contest.services;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.EntityNotFoundException;

import com.photo_contest.models.AppUser;
import com.photo_contest.models.Role;
import com.photo_contest.models.UserProfile;
import com.photo_contest.models.DTO.LoginResponseDTO;
import com.photo_contest.models.DTO.RegistrationDTO;
import com.photo_contest.repos.RoleRepository;
import com.photo_contest.repos.UserRepository;
import com.photo_contest.services.contracts.AuthService;
import com.photo_contest.services.contracts.TokenService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {


    private static final String ROLE_NOT_FOUND_MESSAGE = "Role not found";
    private static final String BASE_USER_ROLE = "USER";

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authManager;
    private final TokenService tokenService;

    @Autowired
    public AuthServiceImpl(
            TokenService tokenService, AuthenticationManager authManager, RoleRepository roleRepository,
            UserRepository userRepository, PasswordEncoder passwordEncoder
    ) {
        this.authManager = authManager;
        this.tokenService = tokenService;
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public AppUser registerUser(RegistrationDTO registrationDTO) {
        AppUser user = new AppUser();
        user.setEmail(registrationDTO.getEmail());
        user.setUsername(registrationDTO.getUsername());
        user.setPassword(passwordEncoder.encode(registrationDTO.getPassword()));


        Role userRole = roleRepository.findByAuthority(BASE_USER_ROLE)
                .orElseThrow(() -> new EntityNotFoundException(ROLE_NOT_FOUND_MESSAGE));
        Set<Role> roles = new HashSet<>();

        roles.add(userRole);
        user.setRoles(roles);

        user = userRepository.save(user);

        UserProfile userProfile = new UserProfile(user);

        user.setUserProfile(userProfile);

        return userRepository.save(user);
    }

    @Override
    public LoginResponseDTO logIn(String username, String password) {
        try {
            Authentication auth = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );

            String token = tokenService.generateJwt(auth);

            return new LoginResponseDTO(userRepository.findByUsername(username).get(), token);

        } catch (AuthenticationException e) {
            return new LoginResponseDTO(null, null);
        }
    }
}
