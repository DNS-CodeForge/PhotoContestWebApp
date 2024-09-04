package com.photo_contest.controllers;

import com.photo_contest.models.AppUser;
import com.photo_contest.models.DTO.LoginDTO;
import com.photo_contest.models.DTO.LoginResponseDTO;
import com.photo_contest.models.DTO.RegistrationDTO;
import com.photo_contest.services.contracts.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    // Registration - return 201 Created
    @PostMapping("/register")
    public ResponseEntity<AppUser> registerUser(@RequestBody RegistrationDTO registrationDTO) {
        AppUser registeredUser = authService.registerUser(registrationDTO);
        return new ResponseEntity<>(registeredUser, HttpStatus.CREATED);
    }


    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> logInUser(@RequestBody LoginDTO loginDTO) {
        LoginResponseDTO loginResponse = authService.logIn(loginDTO.getUsername(), loginDTO.getPassword());

        if (loginResponse.getJwt() != null) {
            return new ResponseEntity<>(loginResponse, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }
}
