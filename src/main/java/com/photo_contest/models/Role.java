package com.photo_contest.models;


import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;

@Entity
@Table(name = "roles")
@Data
@NoArgsConstructor
@AllArgsConstructor

@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Role implements GrantedAuthority {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "role_id")

    private Integer roleId;

    @Column(unique = true, nullable = false)

    @EqualsAndHashCode.Include
    private String authority;

    public Role(String authority) {
        this.authority = authority;
    }

    @Override
    public String getAuthority() {
        return this.authority;
    }
}
