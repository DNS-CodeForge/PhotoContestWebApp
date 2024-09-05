package com.photo_contest.filterSpec;

import com.photo_contest.models.Contest;
import com.photo_contest.models.Phase;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;


import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


public class ContestFilterSpecification {

    public static Specification<Contest> withFiltersAndSort(
            String title,
            String category,
            Boolean isPrivate,
            Boolean active,
            Boolean activeSubmission,
            String sort) {

        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            Optional.ofNullable(title)
                    .filter(t -> !t.isEmpty())
                    .map(t -> criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), "%" + t.toLowerCase() + "%"))
                    .ifPresent(predicates::add);

            Optional.ofNullable(category)
                    .filter(c -> !c.isEmpty())
                    .map(c -> criteriaBuilder.like(criteriaBuilder.lower(root.get("category").as(String.class)), "%" + c.toLowerCase() + "%"))
                    .ifPresent(predicates::add);

            Optional.ofNullable(isPrivate)
                    .map(p -> criteriaBuilder.equal(root.get("isPrivate"), p))
                    .ifPresent(predicates::add);

            // Active contests
            if (active != null) {
                if (active) {
                    predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("endDate"), LocalDateTime.now()));
                } else {
                    predicates.add(criteriaBuilder.lessThan(root.get("endDate"), LocalDateTime.now()));
                }
            }


            if (activeSubmission != null) {
                Join<Contest, Phase> phaseJoin = root.join("phases");


                Predicate phaseOne = criteriaBuilder.equal(phaseJoin.get("type"), Phase.PhaseType.PHASE_ONE);
                Predicate submissionStatus = criteriaBuilder.equal(phaseJoin.get("isConcluded"), !activeSubmission);

                predicates.add(criteriaBuilder.and(phaseOne, submissionStatus));
            }

            if (sort != null) {
                applySort(sort, root, query, criteriaBuilder);
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    private static void applySort(String sort, Root<Contest> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        if (sort == null) {
            query.orderBy(criteriaBuilder.asc(root.get("title")));
        } else {
            switch (sort.toLowerCase()) {
                case "startdateasc":
                    query.orderBy(criteriaBuilder.asc(root.get("startDate")));
                    break;
                case "startdatedesc":
                    query.orderBy(criteriaBuilder.desc(root.get("startDate")));
                    break;
                case "enddateasc":
                    query.orderBy(criteriaBuilder.asc(root.get("endDate")));
                    break;
                case "enddatedesc":
                    query.orderBy(criteriaBuilder.desc(root.get("endDate")));
                    break;
                default:
                    query.orderBy(criteriaBuilder.asc(root.get("title")));
                    break;
            }
        }
    }
}
