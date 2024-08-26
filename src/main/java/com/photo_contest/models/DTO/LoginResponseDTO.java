package com.photo_contest.models.DTO;

import com.photo_contest.models.AppUser;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDTO {
    private AppUser appUser; 
    private String jwt;
}
