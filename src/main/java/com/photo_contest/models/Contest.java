package com.photo_contest.models;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

import static com.photo_contest.constants.ModelValidationConstants.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Contest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @NotBlank(message = TITLE_REQUIRED)
    @Size(min = 6, max = 50, message = TITLE_SIZE)
    private String title;


    @NotNull(message = CATEGORY_REQUIRED)
    @Enumerated(EnumType.STRING)
    private Category category;

    @Column(nullable = false)
    private boolean isPrivate;

    @OneToMany(mappedBy = "contest", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<Phase> phases;

    @OneToMany(mappedBy = "contest", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<PhotoSubmission> photoSubmissions;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "organizer_id")
    @JsonManagedReference
    private UserProfile organizer;

    @ManyToMany(fetch = FetchType.EAGER)
    @JsonManagedReference
    @JoinTable(
            name = "contest_participants",
            joinColumns = @JoinColumn(name = "contest_id"),
            inverseJoinColumns = @JoinColumn(name = "app_user_id")
    )
    private List<UserProfile> participants;

    @ManyToMany(fetch = FetchType.EAGER)
    @JsonManagedReference
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

    @Override
    public String toString() {
        return "Contest{id=" + id + ", title='" + title + "'}";
    }
}
