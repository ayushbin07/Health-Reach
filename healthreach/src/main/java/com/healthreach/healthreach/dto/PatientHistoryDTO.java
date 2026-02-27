package com.healthreach.healthreach.dto;

import com.healthreach.healthreach.model.Case;
import com.healthreach.healthreach.model.Patient;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientHistoryDTO {
    private Patient patientDetails;
    private List<Case> medicalHistory;
}
