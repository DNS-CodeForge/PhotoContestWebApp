package com.photo_contest.services.contracts;

import com.photo_contest.models.AppUser;
import com.photo_contest.models.DTO.RegistrationDTO;;

public interface AuthService {
    AppUser registerUser(RegistrationDTO registrationDTO);
}