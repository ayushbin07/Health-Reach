-- ─── Specialists ────────────────────────────────────────────────────────────
INSERT INTO specialists (name, specialty, language, availability_score) VALUES ('Dr. Sharma',   'General Medicine',   'Hindi',     0.90);
INSERT INTO specialists (name, specialty, language, availability_score) VALUES ('Dr. Iyer',     'Pulmonology',        'Tamil',     0.80);
INSERT INTO specialists (name, specialty, language, availability_score) VALUES ('Dr. Khan',     'Emergency Medicine', 'Hindi',     0.95);
INSERT INTO specialists (name, specialty, language, availability_score) VALUES ('Dr. Banerjee', 'Infectious Disease', 'Bengali',   0.85);
INSERT INTO specialists (name, specialty, language, availability_score) VALUES ('Dr. Patil',    'General Medicine',   'Marathi',   0.88);
INSERT INTO specialists (name, specialty, language, availability_score) VALUES ('Dr. Reddy',    'Internal Medicine',  'Telugu',    0.92);
INSERT INTO specialists (name, specialty, language, availability_score) VALUES ('Dr. Singh',    'Pulmonology',        'Punjabi',   0.75);
INSERT INTO specialists (name, specialty, language, availability_score) VALUES ('Dr. Nair',     'Emergency Medicine', 'Malayalam', 0.91);
INSERT INTO specialists (name, specialty, language, availability_score) VALUES ('Dr. Desai',    'General Medicine',   'Gujarati',  0.89);
INSERT INTO specialists (name, specialty, language, availability_score) VALUES ('Dr. Das',      'Infectious Disease', 'Odia',      0.82);

-- ─── Mock Patients ───────────────────────────────────────────────────────────
INSERT INTO patients (name, age, gender, language, district, created_at) VALUES ('Ravi Kumar',      34, 'Male',   'Hindi',     'Bangalore',  DATEADD('HOUR', -5,  NOW()));
INSERT INTO patients (name, age, gender, language, district, created_at) VALUES ('Priya Nair',      28, 'Female', 'Malayalam', 'Palghar',    DATEADD('HOUR', -8,  NOW()));
INSERT INTO patients (name, age, gender, language, district, created_at) VALUES ('Amir Shaikh',     45, 'Male',   'Hindi',     'Mumbai',     DATEADD('HOUR', -12, NOW()));
INSERT INTO patients (name, age, gender, language, district, created_at) VALUES ('Sunita Devi',     60, 'Female', 'Hindi',     'Nagpur',     DATEADD('HOUR', -20, NOW()));
INSERT INTO patients (name, age, gender, language, district, created_at) VALUES ('Karan Mehta',     22, 'Male',   'Gujarati',  'Pune',       DATEADD('HOUR', -26, NOW()));
INSERT INTO patients (name, age, gender, language, district, created_at) VALUES ('Lakshmi Rao',     52, 'Female', 'Telugu',    'Nashik',     DATEADD('HOUR', -30, NOW()));
INSERT INTO patients (name, age, gender, language, district, created_at) VALUES ('Farida Begum',    38, 'Female', 'Bengali',   'Thane',      DATEADD('HOUR', -36, NOW()));
INSERT INTO patients (name, age, gender, language, district, created_at) VALUES ('Suresh Patil',    70, 'Male',   'Marathi',   'Solapur',    DATEADD('HOUR', -42, NOW()));
INSERT INTO patients (name, age, gender, language, district, created_at) VALUES ('Ananya Das',      19, 'Female', 'Odia',      'Kolhapur',   DATEADD('HOUR', -48, NOW()));
INSERT INTO patients (name, age, gender, language, district, created_at) VALUES ('Harpreet Singh',  41, 'Male',   'Punjabi',   'Aurangabad', DATEADD('HOUR', -55, NOW()));

-- ─── Mock Cases (10 cases, one per patient) ──────────────────────────────────
-- Patient 1: Ravi — Emergency (unconscious + fever + breathlessness → score 16)
INSERT INTO cases (fever, cough, cough_duration_days, breathlessness, unconscious, remarks, severity, triage_score, action, emergency_response_time, diagnosis, confidence, is_outbreak_spike, created_at, patient_id)
VALUES (TRUE, FALSE, 0, TRUE, TRUE, 'Found unconscious at home', 'Emergency', 16, 'AMBULANCE_DISPATCHED', 14, NULL, NULL, FALSE, DATEADD('HOUR', -5, NOW()), 1);

-- Patient 2: Priya — Routine (mild fever → score 3)
INSERT INTO cases (fever, cough, cough_duration_days, breathlessness, unconscious, remarks, severity, triage_score, action, emergency_response_time, diagnosis, confidence, is_outbreak_spike, created_at, patient_id)
VALUES (TRUE, FALSE, 0, FALSE, FALSE, 'Mild fever since 2 days', 'Routine', 3, 'AI_DIAGNOSIS - ESCALATED_TO_SPECIALIST - ASSIGNED_TO_Dr._Nair', NULL, 'Viral Fever', 0.75, FALSE, DATEADD('HOUR', -8, NOW()), 2);

-- Patient 3: Amir — Urgent (fever + breathlessness → score 6)
INSERT INTO cases (fever, cough, cough_duration_days, breathlessness, unconscious, remarks, severity, triage_score, action, emergency_response_time, diagnosis, confidence, is_outbreak_spike, created_at, patient_id)
VALUES (TRUE, FALSE, 0, TRUE, FALSE, 'Chest tightness, difficulty breathing', 'Urgent', 6, 'SPECIALIST_CONSULTATION - ASSIGNED_TO_Dr._Khan', NULL, NULL, NULL, FALSE, DATEADD('HOUR', -12, NOW()), 3);

-- Patient 4: Sunita — Emergency (unconscious → score 10)
INSERT INTO cases (fever, cough, cough_duration_days, breathlessness, unconscious, remarks, severity, triage_score, action, emergency_response_time, diagnosis, confidence, is_outbreak_spike, created_at, patient_id)
VALUES (FALSE, FALSE, 0, FALSE, TRUE, 'Fell down, unresponsive', 'Emergency', 10, 'AMBULANCE_DISPATCHED', 21, NULL, NULL, FALSE, DATEADD('HOUR', -20, NOW()), 4);

-- Patient 5: Karan — Routine (no symptoms → score 0)
INSERT INTO cases (fever, cough, cough_duration_days, breathlessness, unconscious, remarks, severity, triage_score, action, emergency_response_time, diagnosis, confidence, is_outbreak_spike, created_at, patient_id)
VALUES (FALSE, FALSE, 0, FALSE, FALSE, 'General checkup, fatigue', 'Routine', 0, 'AI_DIAGNOSIS - ESCALATED_TO_SPECIALIST - ASSIGNED_TO_Dr._Desai', NULL, 'Viral Fever', 0.75, FALSE, DATEADD('HOUR', -26, NOW()), 5);

-- Patient 6: Lakshmi — Urgent (cough 20 days + fever → score 7)
INSERT INTO cases (fever, cough, cough_duration_days, breathlessness, unconscious, remarks, severity, triage_score, action, emergency_response_time, diagnosis, confidence, is_outbreak_spike, created_at, patient_id)
VALUES (TRUE, TRUE, 20, FALSE, FALSE, 'Persistent cough for 3 weeks', 'Urgent', 7, 'SPECIALIST_CONSULTATION - ASSIGNED_TO_Dr._Reddy', NULL, NULL, NULL, FALSE, DATEADD('HOUR', -30, NOW()), 6);

-- Patient 7: Farida — Routine (cough 20 days → score 4 — TB suspected)
INSERT INTO cases (fever, cough, cough_duration_days, breathlessness, unconscious, remarks, severity, triage_score, action, emergency_response_time, diagnosis, confidence, is_outbreak_spike, created_at, patient_id)
VALUES (TRUE, TRUE, 18, FALSE, FALSE, 'Night sweats, weight loss', 'Routine', 7, 'AI_DIAGNOSIS - ASSIGNED_TO_Dr._Banerjee', NULL, 'Tuberculosis (TB)', 0.92, FALSE, DATEADD('HOUR', -36, NOW()), 7);

-- Patient 8: Suresh — Emergency (unconscious + fever + breathlessness → score 16)
INSERT INTO cases (fever, cough, cough_duration_days, breathlessness, unconscious, remarks, severity, triage_score, action, emergency_response_time, diagnosis, confidence, is_outbreak_spike, created_at, patient_id)
VALUES (TRUE, FALSE, 0, TRUE, TRUE, 'Collapsed in field', 'Emergency', 16, 'AMBULANCE_DISPATCHED', 18, NULL, NULL, FALSE, DATEADD('HOUR', -42, NOW()), 8);

-- Patient 9: Ananya — Routine (fever only → score 3)
INSERT INTO cases (fever, cough, cough_duration_days, breathlessness, unconscious, remarks, severity, triage_score, action, emergency_response_time, diagnosis, confidence, is_outbreak_spike, created_at, patient_id)
VALUES (TRUE, FALSE, 0, FALSE, FALSE, 'Headache and body ache', 'Routine', 3, 'AI_DIAGNOSIS - ESCALATED_TO_SPECIALIST - ASSIGNED_TO_Dr._Das', NULL, 'Viral Fever', 0.75, FALSE, DATEADD('HOUR', -48, NOW()), 9);

-- Patient 10: Harpreet — Urgent (fever + breathlessness → score 6)
INSERT INTO cases (fever, cough, cough_duration_days, breathlessness, unconscious, remarks, severity, triage_score, action, emergency_response_time, diagnosis, confidence, is_outbreak_spike, created_at, patient_id)
VALUES (TRUE, FALSE, 0, TRUE, FALSE, 'Shortness of breath after work', 'Urgent', 6, 'SPECIALIST_CONSULTATION - ASSIGNED_TO_Dr._Singh', NULL, NULL, NULL, FALSE, DATEADD('HOUR', -55, NOW()), 10);

