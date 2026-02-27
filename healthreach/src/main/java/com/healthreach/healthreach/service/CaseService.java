package com.healthreach.healthreach.service;

import java.time.LocalDateTime;

import java.util.List;

import com.healthreach.healthreach.model.Case;
import com.healthreach.healthreach.model.Patient;
import com.healthreach.healthreach.model.Specialist;
import com.healthreach.healthreach.repository.CaseRepository;
import com.healthreach.healthreach.repository.PatientRepository;
import com.healthreach.healthreach.repository.SpecialistRepository;
import org.springframework.stereotype.Service;

@Service
public class CaseService {

    private final CaseRepository caseRepository;
    private final PatientRepository patientRepository;
    private final SpecialistRepository specialistRepository;

    public CaseService(CaseRepository caseRepository,
                       PatientRepository patientRepository,
                       SpecialistRepository specialistRepository) {
        this.caseRepository = caseRepository;
        this.patientRepository = patientRepository;
        this.specialistRepository = specialistRepository;
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

        // Feature 4: Outbreak Spike Detection
        LocalDateTime twentyFourHoursAgo = LocalDateTime.now().minusHours(24);
        long recentCasesInDistrict = caseRepository.countByPatientDistrictAndCreatedAtAfter(
                patient.getDistrict(), twentyFourHoursAgo);
        
        medicalCase.setIsOutbreakSpike(recentCasesInDistrict >= 5);

        if (score >= 10) {
            medicalCase.setSeverity("Emergency");
            // Feature 1: Emergency Handling
            medicalCase.setAction("AMBULANCE_DISPATCHED");
            int minResponse = 10;
            int maxResponse = 25;
            medicalCase.setEmergencyResponseTime(minResponse + (int)(Math.random() * ((maxResponse - minResponse) + 1)));            

        } else if (score >= 6) {
            medicalCase.setSeverity("Urgent");
            medicalCase.setAction("SPECIALIST_CONSULTATION");
            assignSpecialist(medicalCase, patient);
            
        } else {
            medicalCase.setSeverity("Routine");
            medicalCase.setAction("AI_DIAGNOSIS");
            
            // Feature 3: Autonomous Diagnostic AI
            if (Boolean.TRUE.equals(medicalCase.getFever()) && 
                medicalCase.getCoughDurationDays() != null && 
                medicalCase.getCoughDurationDays() > 14) {
                
                medicalCase.setDiagnosis("Tuberculosis (TB)");
                medicalCase.setConfidence(0.92);
            } else {
                medicalCase.setDiagnosis("Viral Fever");
                medicalCase.setConfidence(0.75);
            }
            
            if (medicalCase.getConfidence() < 0.85) {
                String currentAction = medicalCase.getAction() == null ? "" : medicalCase.getAction() + " - ";
                medicalCase.setAction(currentAction + "ESCALATED_TO_SPECIALIST");
                assignSpecialist(medicalCase, patient);
            }
        }

        medicalCase.setPatient(patient);

        return caseRepository.save(medicalCase);
    }

    private void assignSpecialist(Case medicalCase, Patient patient) {
        List<Specialist> specialists = specialistRepository.findAll();

        Specialist best = specialists.stream()
                .max((s1, s2) -> Double.compare(
                        scoreSpecialist(s1, patient),
                        scoreSpecialist(s2, patient)))
                .orElse(null);

        if (best != null) {
            String currentAction = medicalCase.getAction() == null ? "" : medicalCase.getAction() + " - ";
            medicalCase.setAction(currentAction + "ASSIGNED_TO_" + best.getName().replace(" ", "_"));
        }
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