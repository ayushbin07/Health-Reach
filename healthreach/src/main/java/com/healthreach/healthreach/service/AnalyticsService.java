package com.healthreach.healthreach.service;

import com.healthreach.healthreach.repository.CaseRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnalyticsService {

    private final CaseRepository caseRepository;

    public AnalyticsService(CaseRepository caseRepository) {
        this.caseRepository = caseRepository;
    }

    public Map<String, Object> getOutbreaks() {
        LocalDateTime twentyFourHoursAgo = LocalDateTime.now().minusHours(24);
        long recentCases = caseRepository.countByPatientDistrictAndCreatedAtAfter("Palghar", twentyFourHoursAgo);
        
        Map<String, Object> response = new HashMap<>();
        if (recentCases >= 5) {
             response.put("outbreaks", List.of(
                     Map.of(
                             "disease", "Dengue/Viral",
                             "district", "Palghar",
                             "risk_score", 8.2,
                             "recent_cases", recentCases,
                             "recommended_actions", List.of(
                                     "Deploy medical response teams",
                                     "Alert local authorities"
                             )
                     )
             ));
        } else {
             response.put("outbreaks", List.of());
        }
        return response;
    }

    public Map<String, Long> getCaseSummary() {
        LocalDateTime today = LocalDateTime.now().minusHours(24);
        Map<String, Long> summary = new HashMap<>();
        summary.put("totalCases", caseRepository.countByCreatedAtAfter(today));
        summary.put("emergencyCases", caseRepository.countBySeverityAndCreatedAtAfter("Emergency", today));
        summary.put("urgentCases", caseRepository.countBySeverityAndCreatedAtAfter("Urgent", today));
        summary.put("routineCases", caseRepository.countBySeverityAndCreatedAtAfter("Routine", today));
        return summary;
    }
}
