package com.healthreach.healthreach.service;

import com.healthreach.healthreach.dto.PatientHistoryDTO;
import com.healthreach.healthreach.model.Case;
import com.healthreach.healthreach.model.Patient;
import com.healthreach.healthreach.repository.CaseRepository;
import com.healthreach.healthreach.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PatientService {

    private final PatientRepository patientRepository;
    private final CaseRepository caseRepository;

    public PatientService(PatientRepository patientRepository, CaseRepository caseRepository) {
        this.patientRepository = patientRepository;
        this.caseRepository = caseRepository;
    }

    public Patient createPatient(Patient patient) {
        return patientRepository.save(patient);
    }

    public Patient updatePatient(Long id, Patient updatedDetails) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient with ID " + id + " not found"));
        
        if (updatedDetails.getName() != null) patient.setName(updatedDetails.getName());
        if (updatedDetails.getAge() != null) patient.setAge(updatedDetails.getAge());
        if (updatedDetails.getGender() != null) patient.setGender(updatedDetails.getGender());
        if (updatedDetails.getLanguage() != null) patient.setLanguage(updatedDetails.getLanguage());
        if (updatedDetails.getDistrict() != null) patient.setDistrict(updatedDetails.getDistrict());

        return patientRepository.save(patient);
    }

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public PatientHistoryDTO getPatientHistory(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient with ID " + id + " not found"));
        
        // Find all cases tied to this patient ID
        List<Case> history = caseRepository.findAll().stream()
                .filter(c -> c.getPatient().getId().equals(id))
                .toList();

        return PatientHistoryDTO.builder()
                .patientDetails(patient)
                .medicalHistory(history)
                .build();
    }
}