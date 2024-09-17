package com.photo_contest.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.photo_contest.config.AuthContextManager;
import com.photo_contest.models.AppUser;
import com.photo_contest.models.Contest;
import com.photo_contest.models.DTO.UserAppProfileDTO;
import com.photo_contest.models.PhotoSubmission;
import com.photo_contest.models.UserProfile;
import com.photo_contest.models.DTO.EditProfileDTO;
import com.photo_contest.services.contracts.ContestService;
import com.photo_contest.services.contracts.PhotoSubmissionService;
import com.photo_contest.services.contracts.UserService;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;



@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;
    private final ContestService contestService;
    private final PhotoSubmissionService photoSubmissionService;
    private final AuthContextManager authContextManager;

    public UserController(UserService userService, ContestService contestService, PhotoSubmissionService photoSubmissionService, @Qualifier("authContextManager") AuthContextManager authContextManager) {
        this.userService = userService;
        this.contestService = contestService;
        this.photoSubmissionService = photoSubmissionService;
        this.authContextManager = authContextManager;
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserProfile> getUserById(@PathVariable int id) {
        UserProfile user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @GetMapping()
    public ResponseEntity<List<UserProfile>> getUsers() {
        List<UserProfile> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/profile/{id}")
    public ResponseEntity<UserProfile> getUserProfile(@PathVariable int id) {
        UserProfile userProfile = userService.getUserById(id);
        return ResponseEntity.ok(userProfile);
    }


    @GetMapping("/{id}/resources")
    public ResponseEntity<Map<String, Object>> getUserResources(@PathVariable int id) {
        UserProfile userProfile = userService.getUserById(id);
        List<Contest> contests = contestService.findAllContestsByUserProfileId((long) id);
        List<PhotoSubmission> submissions = photoSubmissionService.getSubmissionsByUserId((long) id);

        Map<String, Object> response = new HashMap<>();
        response.put("userProfile", userProfile);
        response.put("contests", contests);
        response.put("submissions", submissions);
        response.put("email", userProfile.getAppUser().getEmail());
        response.put("username", userProfile.getAppUser().getUsername());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/username/{name}")
    public ResponseEntity<UserProfile> getUserByUsername(@PathVariable String name) {
        UserProfile user = userService.getUserByUsername(name);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/contest")
    public ResponseEntity<List<Contest>> getAllContestsByUserProfileId() {
        Long userProfileId = authContextManager.getLoggedInUser().getId();
        List<Contest> contests = userService.getAllContestsByUserProfileId(userProfileId);
        return ResponseEntity.ok(contests);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUserById(@PathVariable int id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping
    public ResponseEntity<UserProfile> updateLoggedUser(@RequestBody EditProfileDTO updatedUser) {
        UserProfile user = userService.updateUserProfile(updatedUser);
        return ResponseEntity.ok(user);
    }
    @GetMapping("/jury/suggestions")
    public ResponseEntity<?> getUserSuggestions(
            @RequestParam String query,
            @RequestParam Long contestId) {
        try {
            List<UserAppProfileDTO> suggestions = userService.findUserWithProfileByUsernameAndNotInContest(query, contestId);
            System.out.println(suggestions);
            var map = new HashMap<String, Object>();
//            map.put("data", suggestions);
            return ResponseEntity.ok(suggestions);
        } catch (Exception e) {
            // Log the error for debugging
            System.err.println("Error fetching user suggestions: " + e.getMessage());

            // Return an error response
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to fetch user suggestions: " + e.getMessage());
        }
    }



}
