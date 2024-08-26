package com.photo_contest.controllers;

import com.photo_contest.models.AppUser;
import com.photo_contest.models.DTO.LoginDTO;
import com.photo_contest.models.DTO.LoginResponseDTO;
import com.photo_contest.models.DTO.RegistrationDTO;
import com.photo_contest.services.contracts.AuthService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public AppUser registerUser(@RequestBody RegistrationDTO registrationDTO) {
        return authService.registerUser(registrationDTO);
    }

    @PostMapping("/login")
    public LoginResponseDTO logInUser(@RequestBody LoginDTO loginDTO) {
        return authService.logIn(loginDTO.getUsername(), loginDTO.getPassword());
    }

}
