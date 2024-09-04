package com.photo_contest.models;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import static com.photo_contest.constants.ModelValidationConstants.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class UserProfile {


    public UserProfile(AppUser appUser) {
        this.appUser = appUser;
    }

    @Id
    @EqualsAndHashCode.Include
    private Long id;

    @OneToOne
    @MapsId
    @JsonBackReference
    @JoinColumn(name = "id")
    private AppUser appUser;

    @Size(max = NAME_MAX_SIZE, message = FIRST_NAME_SIZE_MSG)
    private String firstName;

    @Size(max = NAME_MAX_SIZE, message = LAST_NAME_SIZE_MSG)
    private String lastName;

    @OneToMany(mappedBy = "organizer", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonBackReference
    private List<Contest> contests;

    private int points = 0;

    @Enumerated(EnumType.STRING)
    private Rank rank = Rank.JUNKIE;

    public enum Rank {
        JUNKIE,
        ENTHUSIAST,
        MASTER,
        DICTATOR,
        ORGANIZER
    }

    @Override
    public String toString() {
        return "UserProfile{" +
                "id=" + id +
                ", firstName='" + (firstName != null ? firstName : "not provided") + '\'' +
                ", lastName='" + (lastName != null ? lastName : "not provided") + '\'' +
                ", rank=" + rank +
                ", contests=" + (contests != null ? contests : "not provided") +
                '}';
    }
}