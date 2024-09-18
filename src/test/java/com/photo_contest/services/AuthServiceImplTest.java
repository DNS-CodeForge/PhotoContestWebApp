package com.photo_contest.services;

import com.photo_contest.models.AppUser;
import com.photo_contest.models.DTO.LoginResponseDTO;
import com.photo_contest.models.DTO.RegistrationDTO;
import com.photo_contest.models.Role;
import com.photo_contest.models.UserProfile;
import com.photo_contest.repos.RoleRepository;
import com.photo_contest.repos.UserProfileRepository;
import com.photo_contest.repos.UserRepository;
import com.photo_contest.utils.JwtUtil;
import com.photo_contest.utils.RSAKeyProps;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AuthServiceImplTest {

    @Mock
    private RSAKeyProps rsaKeyProps;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private UserProfileRepository userProfileRepository;

    @InjectMocks
    private AuthServiceImpl authService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testRegisterUser_Success() {
        RegistrationDTO registrationDTO = new RegistrationDTO();
        registrationDTO.setUsername("testuser");
        registrationDTO.setEmail("test@test.com");
        registrationDTO.setPassword("password");

        AppUser newUser = new AppUser();
        newUser.setUsername("testuser");
        newUser.setEmail("test@test.com");
        newUser.setPassword("encodedPassword");

        Role userRole = new Role();
        userRole.setAuthority("USER");


        UserProfile userProfile = new UserProfile(newUser);
        newUser.setUserProfile(userProfile);

        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(roleRepository.findByAuthority(anyString())).thenReturn(Optional.of(userRole));
        when(userRepository.save(any(AppUser.class))).thenReturn(newUser);

        AppUser savedUser = authService.registerUser(registrationDTO);

        assertEquals("testuser", savedUser.getUsername());
        assertEquals("test@test.com", savedUser.getEmail());
        assertNotNull(savedUser);
        assertNotNull(savedUser.getUserProfile()); // This line ensures that the userProfile is not null
        assertEquals(userProfile, savedUser.getUserProfile());

        verify(userRepository, times(2)).save(any(AppUser.class));
        verify(roleRepository, times(1)).findByAuthority(anyString());
    }


    @Test
    void testRegisterUser_RoleNotFound() {
        RegistrationDTO registrationDTO = new RegistrationDTO();
        registrationDTO.setUsername("testuser");

        when(roleRepository.findByAuthority(anyString())).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> authService.registerUser(registrationDTO));
    }




    @Test
    void testLogin_InvalidCredentials() {
        String username = "testuser";
        String password = "wrongpassword";

        // Throw a concrete subclass of AuthenticationException
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Invalid credentials"));

        assertThrows(RuntimeException.class, () -> authService.login(username, password));
    }


    @Test
    void testRefreshAccessToken_Success() {
        String refreshToken = "validRefreshToken";
        String username = "testuser";
        Long userId = 1L;
        AppUser appUser = new AppUser();
        appUser.setId(userId);
        appUser.setUsername(username);


        Role userRole = new Role();
        userRole.setAuthority("ROLE_USER");
        Set<Role> roles = new HashSet<>();
        roles.add(userRole);
        appUser.setRoles(roles);

        UserProfile userProfile = new UserProfile();
        userProfile.setRank(UserProfile.Rank.JUNKIE);

        when(jwtUtil.validateToken(refreshToken)).thenReturn(true);
        when(jwtUtil.getUsernameFromToken(refreshToken)).thenReturn(username);
        when(jwtUtil.getUserIdFromToken(refreshToken)).thenReturn(userId);
        when(userRepository.findById(userId)).thenReturn(Optional.of(appUser));
        when(jwtUtil.generateAccessToken(anyString(), anyLong(), anyList(), anyString())).thenReturn("newAccessToken");
        when(userProfileRepository.findById(userId)).thenReturn(Optional.of(userProfile));

        LoginResponseDTO response = authService.refreshAccessToken(refreshToken);

        assertNotNull(response);
        assertEquals("newAccessToken", response.getAccessToken());
        assertNull(response.getRefreshToken());
    }


    @Test
    void testRefreshAccessToken_InvalidToken() {
        String invalidRefreshToken = "invalidToken";

        when(jwtUtil.validateToken(invalidRefreshToken)).thenReturn(false);

        assertThrows(ResponseStatusException.class, () -> authService.refreshAccessToken(invalidRefreshToken));
    }
}
