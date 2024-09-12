package com.photo_contest.controllers;

import com.photo_contest.models.AppUser;
import com.photo_contest.models.DTO.LoginDTO;
import com.photo_contest.models.DTO.LoginResponseDTO;
import com.photo_contest.models.DTO.RegistrationDTO;
import com.photo_contest.services.contracts.AuthService;
import com.photo_contest.utils.RSAKeyProps;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
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

        Map<String, String> responseMap = new HashMap<>();

        //  response.setHeader("Set-Cookie", bakeCookie(loginResponse)); // HTTP-Only cookie should be used if SSL/TLS is not present -DD

        responseMap.put("refreshToken", loginResponse.getRefreshToken()); // Used if no SSL/TLS is present

        responseMap.put("accessToken", loginResponse.getAccessToken());

        return ResponseEntity.status(HttpStatus.OK).body(responseMap);
    }
    @GetMapping("/public-key")
    public String getPublicKey() {
        return authService.getPublicKey();
    }


    @PostMapping("/refresh")
    //public ResponseEntity<Map<String, String>> refreshAccessToken(@CookieValue("refreshToken") String refreshToken) { // Cookie value should be used if SSL/TLS is present -DD
    public ResponseEntity<Map<String, String>> refreshAccessToken(@RequestBody Map<String, String> requestBody) { // Used if no SSL/TLS is present -DD
        String refreshToken = requestBody.get("refreshToken");
        LoginResponseDTO loginResponse = authService.refreshAccessToken(refreshToken);

        Map<String, String> responseMap = new HashMap<>();
        responseMap.put("accessToken", loginResponse.getAccessToken());

        return ResponseEntity.status(HttpStatus.OK).body(responseMap);
    }

    private static String bakeCookie(LoginResponseDTO loginResponse) {
        return String.format("refreshToken=%s; HttpOnly; Path=/; Max-Age=%d; SameSite=None", loginResponse.getRefreshToken(), 7 * 24 * 60 * 60);
    }
}
