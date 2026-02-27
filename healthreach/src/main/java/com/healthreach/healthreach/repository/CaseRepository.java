package com.healthreach.healthreach.repository;

import com.healthreach.healthreach.model.Case;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CaseRepository extends JpaRepository<Case, Long> {

}