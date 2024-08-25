package com.photo_contest.controllers;

import java.util.List;

import com.photo_contest.models.AppUser;
import com.photo_contest.services.contracts.UserService;

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
    public AppUser getUserById(@PathVariable int id){
        return userService.getUserById(id);
    } 

    @GetMapping()
    public List<AppUser> getUsers(){
        return userService.getAllUsers();
    } 

    @DeleteMapping("/{id}")
    public void deleteUserById(@PathVariable int id) {
        userService.deleteUser(id);
    }
}
