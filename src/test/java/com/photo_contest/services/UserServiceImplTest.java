package com.photo_contest.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Optional;

import com.photo_contest.config.AuthContextManager;
import com.photo_contest.models.AppUser;
import com.photo_contest.models.Contest;
import com.photo_contest.models.Role;
import com.photo_contest.models.UserProfile;
import com.photo_contest.models.DTO.EditProfileDTO;
import com.photo_contest.repos.ContestRepository;
import com.photo_contest.repos.RoleRepository;
import com.photo_contest.repos.UserProfileRepository;
import com.photo_contest.repos.UserRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

public class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserProfileRepository userProfileRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private ContestRepository contestRepository;

    @Mock
    private AuthContextManager authContextManager;

    @InjectMocks
    private UserServiceImpl userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testLoadUserByUsername_UserExists() {
        AppUser appUser = new AppUser();
        appUser.setUsername("testuser");
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(appUser));

        assertEquals(appUser, userService.loadUserByUsername("testuser"));
    }

    @Test
    void testLoadUserByUsername_UserNotFound() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class, () -> userService.loadUserByUsername("testuser"));
    }

    @Test
    void testGetUserById_UserExists() {
        UserProfile userProfile = new UserProfile();
        when(userProfileRepository.findById(1L)).thenReturn(Optional.of(userProfile));

        assertEquals(userProfile, userService.getUserById(1));
    }

    @Test
    void testGetUserById_UserNotFound() {
        when(userProfileRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class, () -> userService.getUserById(1));
    }

    @Test
    void testGetUserByUsername_UserExists() {
        UserProfile userProfile = new UserProfile();
        when(userProfileRepository.findByUsername("testuser")).thenReturn(Optional.of(userProfile));

        assertEquals(userProfile, userService.getUserByUsername("testuser"));
    }

    @Test
    void testGetUserByUsername_UserNotFound() {
        when(userProfileRepository.findByUsername("testuser")).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class, () -> userService.getUserByUsername("testuser"));
    }

    @Test
    void testUpdateUserProfile() {
        UserProfile profile = new UserProfile();
        EditProfileDTO editProfileDTO = new EditProfileDTO();
        editProfileDTO.setFirstName("John");
        editProfileDTO.setLastName("Doe");

        when(authContextManager.getLoggedInUser()).thenReturn(profile);
        when(userProfileRepository.save(profile)).thenReturn(profile);

        UserProfile updatedProfile = userService.updateUserProfile(editProfileDTO);
        assertEquals("John", updatedProfile.getFirstName());
        assertEquals("Doe", updatedProfile.getLastName());
    }

    @Test
    void testGetAllUsers() {
        UserProfile userProfile1 = new UserProfile();
        UserProfile userProfile2 = new UserProfile();
        when(userProfileRepository.findAll()).thenReturn(Arrays.asList(userProfile1, userProfile2));

        assertEquals(2, userService.getAllUsers().size());
    }

    @Test
    void testDeleteUser_UserExists() {
        when(userRepository.existsById(1L)).thenReturn(true);

        userService.deleteUser(1);
        verify(userRepository).deleteById(1L);
    }

    @Test
    void testDeleteUser_UserNotFound() {
        when(userRepository.existsById(1L)).thenReturn(false);

        assertThrows(UsernameNotFoundException.class, () -> userService.deleteUser(1));
    }

    @Test
    void testSetUserRole() {
        AppUser user = new AppUser();
        user.setRoles(new HashSet<>());
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);

        userService.setUserRole(1, "NEWROLE", null);

        assertTrue(user.getRoles().contains(new Role("NEWROLE")));
    }

    @Test
    void testGetAllContestsByUserProfileId() {
        Contest contest1 = new Contest();
        Contest contest2 = new Contest();
        when(contestRepository.findAllContestsByUserProfileId(1L)).thenReturn(Arrays.asList(contest1, contest2));

        assertEquals(2, userService.getAllContestsByUserProfileId(1L).size());
    }

    @Test
    void testAddPoints_UpdatingRankToMaster() {
        AppUser appUser = new AppUser();
        appUser.setRoles(new HashSet<Role>());
        UserProfile userProfile = new UserProfile();
        userProfile.setPoints(100);
        appUser.setUserProfile(userProfile);
        userProfile.setAppUser(appUser);

        when(userRepository.findById(1L)).thenReturn(Optional.of(appUser));
        when(userRepository.save(appUser)).thenReturn(appUser);
        when(roleRepository.findByAuthority("MASTERUSER")).thenReturn(Optional.of(new Role("MASTERUSER")));

        userService.addPoints(1, 52);

        assertEquals(UserProfile.Rank.MASTER, userProfile.getRank());
        verify(userRepository).save(appUser);
    }

    @Test
    void testAddPoints_NoRankUpdateForOrganizer() {
        AppUser appUser = new AppUser();
        UserProfile userProfile = new UserProfile();
        userProfile.setRank(UserProfile.Rank.ORGANIZER); // Rank is ORGANIZER
        appUser.setUserProfile(userProfile);
        when(userRepository.findById(1L)).thenReturn(Optional.of(appUser));

        userService.addPoints(1, 10);

        assertEquals(UserProfile.Rank.ORGANIZER, appUser.getUserProfile().getRank());
        verify(userRepository, never()).save(appUser); 
    }
}
