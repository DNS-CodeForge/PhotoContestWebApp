package com.photo_contest.models.DTO;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
public class UserAppProfileDTO {

    private Long id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
    private String rank;

}
