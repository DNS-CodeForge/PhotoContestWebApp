package com.photo_contest.controllers;

import com.photo_contest.models.AppUser;
import com.photo_contest.models.DTO.RegistrationDTO;
import com.photo_contest.services.contracts.AuthService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public AppUser registerUser(@RequestBody RegistrationDTO registrationDTO) {
        return authService.registerUser(registrationDTO);
    }
}
