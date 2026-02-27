package com.healthreach.healthreach.controller;

import com.healthreach.healthreach.service.AnalyticsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/outbreaks")
    public Map<String, Object> getOutbreaks() {
        return analyticsService.getOutbreaks();
    }

    @GetMapping("/case-summary")
    public Map<String, Long> getCaseSummary() {
        return analyticsService.getCaseSummary();
    }
}
