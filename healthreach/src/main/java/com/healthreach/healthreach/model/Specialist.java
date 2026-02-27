package com.healthreach.healthreach.model;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Specialist {

    private Long id;
    private String name;
    private String specialty;
    private String language;
    private double availabilityScore;
}