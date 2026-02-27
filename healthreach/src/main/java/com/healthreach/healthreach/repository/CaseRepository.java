package com.healthreach.healthreach.repository;

import java.time.LocalDateTime;

import com.healthreach.healthreach.model.Case;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CaseRepository extends JpaRepository<Case, Long> {

    @Query("SELECT COUNT(c) FROM Case c WHERE c.patient.district = :district AND c.createdAt >= :since")
    long countByPatientDistrictAndCreatedAtAfter(@Param("district") String district, @Param("since") LocalDateTime since);

    @Query("SELECT COUNT(c) FROM Case c WHERE c.createdAt >= :since")
    long countByCreatedAtAfter(@Param("since") LocalDateTime since);

    @Query("SELECT COUNT(c) FROM Case c WHERE c.severity = :severity AND c.createdAt >= :since")
    long countBySeverityAndCreatedAtAfter(@Param("severity") String severity, @Param("since") LocalDateTime since);
}