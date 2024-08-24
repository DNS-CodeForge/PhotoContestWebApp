package com.photo_contest.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Contest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Enumerated(EnumType.STRING)
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "phase_id")
    private Phase phase;

    @OneToMany(mappedBy = "contest", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PhotoSubmission> photoSubmissions;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_profile_id")
    private UserProfile userProfile;

    @ManyToMany
    @JoinTable(
            name = "contest_participants",
            joinColumns = @JoinColumn(name = "contest_id"),
            inverseJoinColumns = @JoinColumn(name = "app_user_id")
    )
    private List<AppUser> participants;

    @ManyToMany
    @JoinTable(
            name = "contest_jury",
            joinColumns = @JoinColumn(name = "contest_id"),
            inverseJoinColumns = @JoinColumn(name = "app_user_id")
    )
    private List<AppUser> jury;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private LocalDateTime startDateTimePhase1;
    private LocalDateTime endDateTimePhase1;

    private LocalDateTime startDateTimePhase2;
    private LocalDateTime endDateTimePhase2;


    public enum Category {
        LANDSCAPE,
        PORTRAIT,
        STREET,
        WILDLIFE,
        ABSTRACT
    }
}
