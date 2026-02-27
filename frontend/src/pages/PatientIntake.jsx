import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../api/config';
import { ArrowLeft, AlertCircle, CheckCircle2, Clock, User } from 'lucide-react';
import TriageResultMap from '../components/TriageResultMap';

const GENDERS = ['', 'Male', 'Female', 'Other'];
const LANGUAGES = ['Hindi', 'Tamil', 'Bengali', 'Marathi', 'Telugu', 'Punjabi', 'Malayalam', 'Gujarati', 'Odia', 'English'];
const DISTRICTS = ['Bangalore', 'Palghar', 'Mumbai', 'Pune', 'Nashik', 'Nagpur', 'Thane', 'Aurangabad', 'Solapur', 'Kolhapur', 'Nanded'];

const DEFAULT_PATIENT = { name: '', age: '', gender: '', language: 'Hindi', district: 'Bangalore' };
const DEFAULT_SYMPTOMS = { fever: false, cough: false, coughDurationDays: 0, breathlessness: false, unconscious: false, remarks: '' };

export default function PatientIntake() {
    const nav = useNavigate();
    const [patient, setPatient] = useState(DEFAULT_PATIENT);
    const [symptoms, setSymptoms] = useState(DEFAULT_SYMPTOMS);

    const mutation = useMutation({
        mutationFn: async () => {
            const created = await axios.post(`${API_BASE}/api/patients`, {
                name: patient.name.trim(), age: parseInt(patient.age),
                gender: patient.gender, language: patient.language, district: patient.district,
            });
            const patientId = created.data.id;
            const caseRes = await axios.post(`${API_BASE}/api/cases/${patientId}`, symptoms);
            return { caseData: caseRes.data, district: patient.district, patientName: patient.name };
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!patient.name.trim() || !patient.age) return;
        mutation.mutate();
    };

    if (mutation.isSuccess && mutation.data) {
        return (
            <TriageResultMap
                caseData={mutation.data.caseData}
                district={mutation.data.district}
                patientName={mutation.data.patientName}
                onBack={() => mutation.reset()}
            />
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#F0FDFF', fontFamily: "'Source Sans 3', system-ui, sans-serif" }}>
            <div style={{ maxWidth: 680, margin: '0 auto', padding: '32px 24px' }}>

                <button onClick={() => nav('/role')} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 600, color: '#475569', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 32 }}>
                    <ArrowLeft size={16} /> Back
                </button>

                <div style={{ marginBottom: 32 }}>
                    <h1 style={{ fontFamily: "'Lexend', sans-serif", fontSize: 30, fontWeight: 800, color: '#0C3547' }}>Patient Registration</h1>
                    <p style={{ color: '#475569', marginTop: 6 }}>Fill in your details and symptoms to get AI triage</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                    {/* Personal Details */}
                    <Card title="Personal Details" icon={<User size={16} />}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label className="label">Full Name</label>
                                <input required className="input" placeholder="Enter full name"
                                    value={patient.name} onChange={e => setPatient({ ...patient, name: e.target.value })} />
                            </div>
                            <div>
                                <label className="label">Age</label>
                                <input required type="number" min="0" max="120" className="input" placeholder="Age"
                                    value={patient.age} onChange={e => setPatient({ ...patient, age: e.target.value })} />
                            </div>
                            <div>
                                <label className="label">Gender</label>
                                <select className="input" value={patient.gender} onChange={e => setPatient({ ...patient, gender: e.target.value })}>
                                    {GENDERS.map(g => <option key={g}>{g}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="label">Language</label>
                                <select className="input" value={patient.language} onChange={e => setPatient({ ...patient, language: e.target.value })}>
                                    {LANGUAGES.map(l => <option key={l}>{l}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="label">District</label>
                                <select className="input" value={patient.district} onChange={e => setPatient({ ...patient, district: e.target.value })}>
                                    {DISTRICTS.map(d => <option key={d}>{d}</option>)}
                                </select>
                            </div>
                        </div>
                    </Card>

                    {/* Symptoms */}
                    <Card title="Symptoms">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <Toggle label="High Fever" checked={symptoms.fever} onChange={v => setSymptoms({ ...symptoms, fever: v })} />
                            <Toggle label="Cough" checked={symptoms.cough} onChange={v => setSymptoms({ ...symptoms, cough: v })} />
                            {symptoms.cough && (
                                <div style={{ paddingLeft: 16, borderLeft: '2px solid #67E8F9', marginLeft: 4 }}>
                                    <label className="label">Cough Duration (days)</label>
                                    <input type="number" min="0" className="input" style={{ maxWidth: 160 }}
                                        value={symptoms.coughDurationDays}
                                        onChange={e => setSymptoms({ ...symptoms, coughDurationDays: parseInt(e.target.value) || 0 })} />
                                </div>
                            )}
                            <Toggle label="Breathlessness / Difficulty Breathing" checked={symptoms.breathlessness} onChange={v => setSymptoms({ ...symptoms, breathlessness: v })} />
                            <Toggle label="Unconscious or Unresponsive" checked={symptoms.unconscious} onChange={v => setSymptoms({ ...symptoms, unconscious: v })} />
                        </div>
                    </Card>

                    {/* Remarks */}
                    <Card title="Additional Remarks">
                        <textarea className="input" style={{ resize: 'none', minHeight: 90 }}
                            placeholder="Describe any other symptoms or concerns..."
                            value={symptoms.remarks} onChange={e => setSymptoms({ ...symptoms, remarks: e.target.value })} />
                    </Card>

                    {mutation.isError && (
                        <div style={{ padding: '14px 18px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, color: '#DC2626', fontSize: 14 }}>
                            ⚠️ Failed to connect. Is Spring Boot running on port 8080?
                        </div>
                    )}

                    <button type="submit" disabled={mutation.isPending}
                        style={{ padding: '16px', borderRadius: 14, background: mutation.isPending ? '#94A3B8' : 'linear-gradient(135deg, #0891B2, #164E63)', color: 'white', fontWeight: 700, fontSize: 16, border: 'none', cursor: 'pointer' }}>
                        {mutation.isPending ? 'Processing...' : 'Submit & Get Triage Result →'}
                    </button>
                </form>
            </div>
        </div>
    );
}

function Card({ title, children, icon }) {
    return (
        <div style={{ background: 'white', borderRadius: 18, padding: '24px', border: '1.5px solid #E2E8F0', boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontFamily: "'Lexend', sans-serif", fontWeight: 700, fontSize: 16, color: '#0C3547', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>{icon}{title}</h3>
            {children}
        </div>
    );
}

function Toggle({ label, checked, onChange }) {
    return (
        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: '#F8FAFC', borderRadius: 12, cursor: 'pointer' }}>
            <span style={{ fontWeight: 500, color: '#334155' }}>{label}</span>
            <div onClick={() => onChange(!checked)}
                style={{ position: 'relative', width: 44, height: 24, borderRadius: 12, flexShrink: 0, background: checked ? '#0891B2' : '#CBD5E1', transition: 'background 0.2s' }}>
                <div style={{ position: 'absolute', top: 4, left: checked ? 22 : 4, width: 16, height: 16, borderRadius: '50%', background: 'white', transition: 'left 0.2s' }} />
            </div>
        </label>
    );
}
