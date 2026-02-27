package com.healthreach.healthreach.repository;

import com.healthreach.healthreach.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientRepository extends JpaRepository<Patient, Long> {

}