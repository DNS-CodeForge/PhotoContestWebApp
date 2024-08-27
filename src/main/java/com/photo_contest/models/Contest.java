package com.photo_contest.models;

import com.fasterxml.jackson.annotation.JsonManagedReference;
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

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "phase_id")
    private Phase phase;

    @OneToMany(mappedBy = "contest", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<PhotoSubmission> photoSubmissions;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "organizer_id")
    @JsonManagedReference
    private UserProfile organizer;

    @ManyToMany
    @JsonManagedReference
    @JoinTable(
            name = "contest_participants",
            joinColumns = @JoinColumn(name = "contest_id"),
            inverseJoinColumns = @JoinColumn(name = "app_user_id")
    )
    private List<UserProfile> participants;

    @JsonManagedReference
    @ManyToMany
    @JoinTable(
            name = "contest_jury",
            joinColumns = @JoinColumn(name = "contest_id"),
            inverseJoinColumns = @JoinColumn(name = "app_user_id")
    )
    private List<UserProfile> jury;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private LocalDateTime startDate;
    private LocalDateTime endDate;


    public enum Category {
        LANDSCAPE,
        PORTRAIT,
        STREET,
        WILDLIFE,
        ABSTRACT
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
