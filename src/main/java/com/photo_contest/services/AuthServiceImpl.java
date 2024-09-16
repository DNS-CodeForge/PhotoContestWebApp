package com.photo_contest.services;

import com.photo_contest.models.AppUser;
import com.photo_contest.models.DTO.LoginResponseDTO;
import com.photo_contest.models.DTO.RegistrationDTO;
import com.photo_contest.models.Role;
import com.photo_contest.models.UserProfile;
import com.photo_contest.repos.RoleRepository;
import com.photo_contest.repos.UserProfileRepository;
import com.photo_contest.repos.UserRepository;
import com.photo_contest.services.contracts.AuthService;

import com.photo_contest.utils.JwtUtil;
import com.photo_contest.utils.RSAKeyProps;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.server.ResponseStatusException;

import java.util.Base64;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static com.photo_contest.constants.ModelValidationConstants.INVALID_LOGIN_CREDENTIALS;

@Service
public class AuthServiceImpl implements AuthService {
    private static final String ROLE_NOT_FOUND_MESSAGE = "Role not found";
    private static final String BASE_USER_ROLE = "USER";
    public static final String INVALID_REFRESH_TOKEN = "Invalid refresh token";
    private final RSAKeyProps rsaKeyProps;

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserProfileRepository userProfileRepository;


    @Autowired
    public AuthServiceImpl(RSAKeyProps rsaKeyProps, AuthenticationManager authenticationManager, JwtUtil jwtUtil, PasswordEncoder passwordEncoder, UserRepository userRepository, RoleRepository roleRepository, UserProfileRepository userProfileRepository) {
        this.rsaKeyProps = rsaKeyProps;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;

        this.roleRepository = roleRepository;
        this.userProfileRepository = userProfileRepository;
    }


    @Override
    public AppUser registerUser(RegistrationDTO registrationDTO) {
        AppUser newUser = new AppUser();
        newUser.setUsername(registrationDTO.getUsername());
        newUser.setEmail(registrationDTO.getEmail());
        newUser.setPassword(passwordEncoder.encode(registrationDTO.getPassword()));

        Role userRole = roleRepository.findByAuthority(BASE_USER_ROLE).orElseThrow(() -> new EntityNotFoundException(ROLE_NOT_FOUND_MESSAGE));
        Set<Role> roles = new HashSet<>();

        roles.add(userRole);
        newUser.setRoles(roles);

        newUser = userRepository.save(newUser);

        UserProfile userProfile = new UserProfile(newUser);

        newUser.setUserProfile(userProfile);

        return userRepository.save(newUser);
    }


    @Override
    public LoginResponseDTO login(String username, String password) {
        try {

            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));


            AppUser authenticatedUser = (AppUser) authentication.getPrincipal();
            Long userId = authenticatedUser.getId();


            List<String> roles = authentication.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList());

            String rank = userProfileRepository.findById(userId).get().getRank().toString();
            String accessToken = jwtUtil.generateAccessToken(username, userId, roles, rank);
            String refreshToken = jwtUtil.generateRefreshToken(username, userId);

            return new LoginResponseDTO(accessToken, refreshToken);

        } catch (AuthenticationException e) {
            throw new RuntimeException(INVALID_LOGIN_CREDENTIALS, e);
        }
    }

    public String getPublicKey() {
        return Base64.getEncoder().encodeToString(rsaKeyProps.getPublicKey().getEncoded());
    }


    @Override
    public LoginResponseDTO refreshAccessToken(String refreshToken) {
        if (jwtUtil.validateToken(refreshToken)) {

            String username = jwtUtil.getUsernameFromToken(refreshToken);
            Long userId = jwtUtil.getUserIdFromToken(refreshToken);


            AppUser user = userRepository.findById(userId).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));


            List<String> roles = user.getRoles().stream().map(Role::getAuthority).collect(Collectors.toList());
            String rank = userProfileRepository.findById(userId).get().getRank().toString();
            String newAccessToken = jwtUtil.generateAccessToken(username, userId, roles, rank);

            return new LoginResponseDTO(newAccessToken, null);
        } else {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid refresh token");
        }
    }


}