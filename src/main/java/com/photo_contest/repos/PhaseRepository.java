package com.photo_contest.repos;

import com.photo_contest.models.Phase;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhaseRepository extends JpaRepository<Phase,Long>{
    List<Phase> findByType(Phase.PhaseType phaseType);
}
