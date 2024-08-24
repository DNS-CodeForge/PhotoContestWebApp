package com.photo_contest.models;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfile {

    @Id
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
