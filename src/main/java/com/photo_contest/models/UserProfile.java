package com.photo_contest.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Size(max = 26, message = "First name cannot be longer than 26 characters")
    private String firstName;

    @Size(max = 26, message = "Last name cannot be longer than 26 characters")
    private String lastName;

    @OneToOne
    @JoinColumn(name = "app_user_id")
    private AppUser appUser;

    @OneToMany(mappedBy = "userProfile", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Contest> contests;

    @Enumerated(EnumType.STRING)
    private Rank rank = Rank.JUNKIE;

    public enum Rank {
        JUNKIE,
        ENTHUSIAST,
        ORGANISER,
        MASTER
    }

}
