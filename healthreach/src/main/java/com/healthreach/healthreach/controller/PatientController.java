package com.healthreach.healthreach.controller;

import com.healthreach.healthreach.model.Patient;
import com.healthreach.healthreach.service.PatientService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @PostMapping
    public Patient createPatient(@RequestBody Patient patient) {
        return patientService.createPatient(patient);
    }

    @PutMapping("/{id}")
    public Patient updatePatient(@PathVariable Long id, @RequestBody Patient patient) {
        return patientService.updatePatient(id, patient);
    }

    @GetMapping
    public List<Patient> getAllPatients() {
        return patientService.getAllPatients();
    }

    @GetMapping("/{id}/history")
    public com.healthreach.healthreach.dto.PatientHistoryDTO getPatientHistory(@PathVariable Long id) {
        return patientService.getPatientHistory(id);
    }
}