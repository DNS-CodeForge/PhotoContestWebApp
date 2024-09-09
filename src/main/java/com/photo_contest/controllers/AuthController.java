package com.photo_contest.controllers;

import com.photo_contest.models.AppUser;
import com.photo_contest.models.DTO.LoginDTO;
import com.photo_contest.models.DTO.LoginResponseDTO;
import com.photo_contest.models.DTO.RegistrationDTO;
import com.photo_contest.services.contracts.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AppUser> registerUser(@RequestBody RegistrationDTO registrationDTO) {
        AppUser registeredUser = authService.registerUser(registrationDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(registeredUser);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> logInUser(@RequestBody LoginDTO loginDTO, HttpServletResponse response) {
        LoginResponseDTO loginResponse = authService.login(loginDTO.getUsername(), loginDTO.getPassword());

        Cookie refreshTokenCookie = new Cookie("refreshToken", loginResponse.getRefreshToken());
        refreshTokenCookie.setHttpOnly(true);
        // TODO
        refreshTokenCookie.setSecure(false);
        refreshTokenCookie.setPath("/api/auth/refresh");
        refreshTokenCookie.setMaxAge(7 * 24 * 60 * 60);
        response.addCookie(refreshTokenCookie);

        Map<String, String> responseMap = new HashMap<>();
        responseMap.put("accessToken", loginResponse.getAccessToken());

        return ResponseEntity.status(HttpStatus.OK).body(responseMap);
    }

    @PostMapping("/refresh")
    public ResponseEntity<Map<String, String>> refreshAccessToken(@CookieValue("refreshToken") String refreshToken) {
        LoginResponseDTO loginResponse = authService.refreshAccessToken(refreshToken);

        Map<String, String> responseMap = new HashMap<>();
        responseMap.put("accessToken", loginResponse.getAccessToken());

        return ResponseEntity.status(HttpStatus.OK).body(responseMap);
    }
}
