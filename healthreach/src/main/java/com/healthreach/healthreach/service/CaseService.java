package com.healthreach.healthreach.service;

import java.util.List;

import com.healthreach.healthreach.model.Case;
import com.healthreach.healthreach.model.Patient;
import com.healthreach.healthreach.model.Specialist;
import com.healthreach.healthreach.repository.CaseRepository;
import com.healthreach.healthreach.repository.PatientRepository;
import org.springframework.stereotype.Service;

@Service
public class CaseService {

    private final CaseRepository caseRepository;
    private final PatientRepository patientRepository;

    private List<Specialist> specialists = List.of(
            new Specialist(1L, "Dr. Sharma", "General Medicine", "Hindi", 0.9),
            new Specialist(2L, "Dr. Iyer", "Pulmonology", "Tamil", 0.8),
            new Specialist(3L, "Dr. Khan", "Emergency Medicine", "Hindi", 0.95)
    );

    public CaseService(CaseRepository caseRepository,
                       PatientRepository patientRepository) {
        this.caseRepository = caseRepository;
        this.patientRepository = patientRepository;
    }

    public Case createCase(Long patientId, Case medicalCase) {

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        double score = 0;

        if (Boolean.TRUE.equals(medicalCase.getFever())) score += 3;

        if (Boolean.TRUE.equals(medicalCase.getCough())
                && medicalCase.getCoughDurationDays() != null
                && medicalCase.getCoughDurationDays() > 14) score += 4;

        if (Boolean.TRUE.equals(medicalCase.getBreathlessness())) score += 3;

        if (Boolean.TRUE.equals(medicalCase.getUnconscious())) score += 10;

        medicalCase.setTriageScore(score);

        if (score >= 10) {
            medicalCase.setSeverity("Emergency");
            medicalCase.setAction("IMMEDIATE_ATTENTION");
        } else if (score >= 6) {
            medicalCase.setSeverity("Urgent");
            medicalCase.setAction("SPECIALIST_CONSULTATION");
        } else {
            medicalCase.setSeverity("Routine");
            medicalCase.setAction("AI_DIAGNOSIS");
        }

        if ("Urgent".equals(medicalCase.getSeverity())) {

            Specialist best = specialists.stream()
                    .max((s1, s2) -> Double.compare(
                            scoreSpecialist(s1, patient),
                            scoreSpecialist(s2, patient)))
                    .orElse(null);

            if (best != null) {
                medicalCase.setAction(
                        "ASSIGNED_TO_" + best.getName().replace(" ", "_"));
            }
        }

        medicalCase.setPatient(patient);

        return caseRepository.save(medicalCase);
    }

    private double scoreSpecialist(Specialist specialist, Patient patient) {

        double score = 0;

        if (specialist.getLanguage().equalsIgnoreCase(patient.getLanguage())) {
            score += 0.4;
        }

        score += specialist.getAvailabilityScore() * 0.6;

        return score;
    }
}