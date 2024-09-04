package com.photo_contest.models.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import static com.photo_contest.constants.ModelValidationConstants.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationDTO {

    @NotBlank(message = EMAIL_MANDATORY)
    @Email(message = EMAIL_VALIDATION_MESSAGE)
    private String email;

    @NotBlank(message = PASSWORD_MANDATORY)
    @Size(min = 6, message = PASSWORD_SIZE_MESSAGE)
    private String password;

    @NotBlank(message = USERNAME_MANDATORY)
    @Size(min = 4, message = USERNAME_SIZE_MESSAGE)
    private String username;
}
