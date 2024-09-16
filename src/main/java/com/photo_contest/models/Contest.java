package com.photo_contest.models;

import static com.photo_contest.constants.ModelValidationConstants.CATEGORY_REQUIRED;
import static com.photo_contest.constants.ModelValidationConstants.TITLE_REQUIRED;
import static com.photo_contest.constants.ModelValidationConstants.TITLE_SIZE;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

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
    private List<UserProfile> participants = new ArrayList<>();

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
    private LocalDateTime SubmissionEndDate;
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
