package com.healthreach.healthreach.controller;

import com.healthreach.healthreach.model.Case;
import com.healthreach.healthreach.service.CaseService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cases")
public class CaseController {

    private final CaseService caseService;

    public CaseController(CaseService caseService) {
        this.caseService = caseService;
    }

    @PostMapping("/{patientId}")
    public Case createCase(@PathVariable Long patientId,
                           @RequestBody Case medicalCase) {
        return caseService.createCase(patientId, medicalCase);
    }
}