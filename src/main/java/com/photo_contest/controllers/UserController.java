package com.photo_contest.controllers;

import java.util.List;

import com.photo_contest.models.AppUser;
import com.photo_contest.models.Contest;
import com.photo_contest.models.UserProfile;
import com.photo_contest.services.contracts.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
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

    @GetMapping("/username/{name}")
    public ResponseEntity<UserProfile> getUserByUsername(@PathVariable String name) {
        UserProfile user = userService.getUserByUsername(name);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/contest")
    public ResponseEntity<List<Contest>> getAllContestsByUserProfileId(@RequestParam Long userProfileId) {
        List<Contest> contests = userService.getAllContestsByUserProfileId(userProfileId);
        return ResponseEntity.ok(contests);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUserById(@PathVariable int id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
