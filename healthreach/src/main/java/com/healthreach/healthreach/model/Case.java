package com.healthreach.healthreach.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "cases")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Case {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // --- Symptoms ---
    private Boolean fever;
    private Boolean cough;
    private Integer coughDurationDays;
    private Boolean breathlessness;
    private Boolean unconscious;

    // --- Calculated Fields ---
    private String severity;
    private Double triageScore;
    private String action;

    // --- Emergency/Routing Details ---
    private Integer emergencyResponseTime; // in minutes

    // --- Diagnosis Tracking ---
    private String diagnosis;
    private Double confidence;

    // --- Outbreak Tracking ---
    // --- Outbreak Tracking ---
    @Column(columnDefinition = "boolean default false")
    private Boolean isOutbreakSpike = Boolean.FALSE;

    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    @JsonIgnore
    private Patient patient;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}