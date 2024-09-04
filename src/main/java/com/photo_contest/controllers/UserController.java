package com.photo_contest.controllers;

import java.util.List;

import com.photo_contest.models.AppUser;
import com.photo_contest.models.Contest;
import com.photo_contest.models.UserProfile;
import com.photo_contest.services.contracts.UserService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @GetMapping()
    public ResponseEntity<List<UserProfile>> getUsers() {
        List<UserProfile> users = userService.getAllUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @GetMapping("/profile/{id}")
    public ResponseEntity<UserProfile> getUserProfile(@PathVariable int id) {
        UserProfile userProfile = userService.getUserById(id);
        return new ResponseEntity<>(userProfile, HttpStatus.OK);
    }

    @GetMapping("/username/{name}")
    public ResponseEntity<UserProfile> getUserByUsername(@PathVariable String name) {
        UserProfile user = userService.getUserByUsername(name);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @GetMapping("/contest")
    public ResponseEntity<List<Contest>> getAllContestsByUserProfileId(Long userProfileId) {
        List<Contest> contests = userService.getAllContestsByUserProfileId(userProfileId);
        return new ResponseEntity<>(contests, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUserById(@PathVariable int id) {
        userService.deleteUser(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
