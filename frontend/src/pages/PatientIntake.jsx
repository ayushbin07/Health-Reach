import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../api/config';
import { ArrowLeft, CheckCircle2, AlertCircle, Clock, User } from 'lucide-react';

// Enums matching the backend data
const GENDERS = ['Male', 'Female', 'Other'];
const LANGUAGES = ['Hindi', 'Tamil', 'Bengali', 'Marathi', 'Telugu', 'Punjabi', 'Malayalam', 'Gujarati', 'Odia', 'English'];
const DISTRICTS = ['Palghar', 'Mumbai', 'Pune', 'Nashik', 'Nagpur', 'Thane', 'Aurangabad', 'Solapur', 'Kolhapur', 'Nanded'];

const DEFAULT_PATIENT = { name: '', age: '', gender: 'Female', language: 'Hindi', district: 'Palghar' };
const DEFAULT_CASE = { fever: false, cough: false, coughDurationDays: 0, breathlessness: false, unconscious: false, remarks: '' };

export default function PatientIntake() {
    const nav = useNavigate();
    const [patient, setPatient] = useState(DEFAULT_PATIENT);
    const [symptoms, setSymptoms] = useState(DEFAULT_CASE);

    // Step 1: Create patient
    // Step 2: Create case with returned patient ID
    const mutation = useMutation({
        mutationFn: async () => {
            const created = await axios.post(`${API_BASE}/api/patients`, {
                name: patient.name.trim(),
                age: parseInt(patient.age),
                gender: patient.gender,
                language: patient.language,
                district: patient.district,
            });
            const patientId = created.data.id;
            const caseRes = await axios.post(`${API_BASE}/api/cases/${patientId}`, symptoms);
            return caseRes.data;
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!patient.name.trim() || !patient.age) return;
        mutation.mutate();
    };

    if (mutation.isSuccess && mutation.data) return <TriageResult data={mutation.data} onBack={() => mutation.reset()} />;

    return (
        <div className="min-h-screen" style={{ background: '#F0FDFF' }}>
            <div className="max-w-2xl mx-auto px-4 py-8">
                <button onClick={() => nav('/role')}
                    className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary-600 transition-colors cursor-pointer mb-8">
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>

                <div className="mb-8">
                    <h1 className="text-3xl font-heading font-bold text-primary-600">Patient Registration</h1>
                    <p className="text-slate-500 mt-1">Fill in your details and symptoms to get AI triage</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* --- Personal Details --- */}
                    <Section title="Personal Details" icon={<User className="w-4 h-4" />}>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
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
                                <select className="input" value={patient.gender}
                                    onChange={e => setPatient({ ...patient, gender: e.target.value })}>
                                    {GENDERS.map(g => <option key={g}>{g}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="label">Language</label>
                                <select className="input" value={patient.language}
                                    onChange={e => setPatient({ ...patient, language: e.target.value })}>
                                    {LANGUAGES.map(l => <option key={l}>{l}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="label">District</label>
                                <select className="input" value={patient.district}
                                    onChange={e => setPatient({ ...patient, district: e.target.value })}>
                                    {DISTRICTS.map(d => <option key={d}>{d}</option>)}
                                </select>
                            </div>
                        </div>
                    </Section>

                    {/* --- Symptoms --- */}
                    <Section title="Symptoms">
                        <div className="space-y-3">
                            <Toggle label="High Fever" checked={symptoms.fever}
                                onChange={v => setSymptoms({ ...symptoms, fever: v })} />
                            <Toggle label="Cough" checked={symptoms.cough}
                                onChange={v => setSymptoms({ ...symptoms, cough: v })} />
                            {symptoms.cough && (
                                <div className="pl-4 border-l-2 border-cyan-200">
                                    <label className="label">Cough Duration (days)</label>
                                    <input type="number" min="0" className="input w-40" value={symptoms.coughDurationDays}
                                        onChange={e => setSymptoms({ ...symptoms, coughDurationDays: parseInt(e.target.value) || 0 })} />
                                </div>
                            )}
                            <Toggle label="Breathlessness / Difficulty Breathing" checked={symptoms.breathlessness}
                                onChange={v => setSymptoms({ ...symptoms, breathlessness: v })} />
                            <Toggle label="Unconscious or Unresponsive" checked={symptoms.unconscious}
                                onChange={v => setSymptoms({ ...symptoms, unconscious: v })} />
                        </div>
                    </Section>

                    {/* --- Remarks --- */}
                    <Section title="Additional Remarks">
                        <textarea
                            className="input resize-none"
                            style={{ minHeight: '100px' }}
                            placeholder="Describe any other symptoms or concerns..."
                            value={symptoms.remarks}
                            onChange={e => setSymptoms({ ...symptoms, remarks: e.target.value })}
                        />
                    </Section>

                    {mutation.isError && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                            ⚠️ Failed to connect to server. Is Spring Boot running on port 8080?
                        </div>
                    )}

                    <button type="submit" disabled={mutation.isPending}
                        style={{ background: mutation.isPending ? '#94A3B8' : 'linear-gradient(135deg, #0891B2, #164E63)' }}
                        className="w-full py-4 text-white font-bold text-lg rounded-xl transition-all active:scale-95 cursor-pointer">
                        {mutation.isPending ? 'Processing...' : 'Submit & Get Triage Result →'}
                    </button>
                </form>
            </div>

            {/* Global input styles */}
            <style>{`
        .label { display:block; font-size:0.8rem; font-weight:600; color:#475569; margin-bottom:6px; text-transform:uppercase; letter-spacing:0.05em; }
        .input { width:100%; padding:12px 16px; border:1.5px solid #E2E8F0; border-radius:12px; outline:none; font-size:0.95rem; background:white; transition:border-color 0.15s; }
        .input:focus { border-color:#0891B2; box-shadow: 0 0 0 3px rgba(8,145,178,0.1); }
      `}</style>
        </div>
    );
}

function Section({ title, children, icon }) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="font-heading font-bold text-slate-900 mb-4 flex items-center gap-2">
                {icon} {title}
            </h3>
            {children}
        </div>
    );
}

function Toggle({ label, checked, onChange }) {
    return (
        <label className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors">
            <span className="font-medium text-slate-800">{label}</span>
            <div onClick={() => onChange(!checked)}
                style={{ background: checked ? '#0891B2' : '#CBD5E1', transition: 'background 0.2s', position: 'relative', width: '44px', height: '24px', borderRadius: '12px', flexShrink: 0 }}>
                <div style={{
                    position: 'absolute', top: '4px', left: checked ? '22px' : '4px', width: '16px', height: '16px',
                    background: 'white', borderRadius: '50%', transition: 'left 0.2s'
                }} />
            </div>
        </label>
    );
}

function TriageResult({ data, onBack }) {
    const nav = useNavigate();
    const severity = data.severity?.toUpperCase();
    const color = severity === 'EMERGENCY' ? '#EF4444' : severity === 'URGENT' ? '#F97316' : '#059669';

    // Parse specialist name from action string e.g. "AI_DIAGNOSIS - ASSIGNED_TO_Dr._Iyer"
    const specialistMatch = data.action?.match(/ASSIGNED_TO_(.+)$/);
    const specialistName = specialistMatch ? specialistMatch[1].replace(/_/g, ' ') : null;

    return (
        <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#F0FDFF' }}>
            <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                <div style={{ height: '6px', background: color }} />
                <div className="p-8 space-y-6">
                    <div className="flex items-center gap-3">
                        {severity === 'EMERGENCY'
                            ? <AlertCircle className="w-9 h-9" style={{ color }} />
                            : <CheckCircle2 className="w-9 h-9" style={{ color }} />}
                        <div>
                            <h2 className="text-2xl font-heading font-bold text-slate-900">{data.severity} Protocol</h2>
                            <p className="text-sm text-slate-400">Triage Score: {data.triageScore}/10</p>
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4 space-y-2.5">
                        {[
                            { label: 'Diagnosis', value: data.diagnosis },
                            { label: 'Confidence', value: data.confidence ? `${(data.confidence * 100).toFixed(0)}%` : null },
                            { label: 'Priority', value: data.action?.split(' - ')[0] },
                        ].filter(r => r.value).map(row => (
                            <div key={row.label} className="flex justify-between text-sm">
                                <span className="text-slate-500">{row.label}</span>
                                <span className="font-semibold text-slate-900">{row.value}</span>
                            </div>
                        ))}
                    </div>

                    {specialistName && (
                        <div className="border-t border-slate-100 pt-4">
                            <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-3">Assigned Specialist</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center font-bold text-lg text-primary-600">
                                    {specialistName.charAt(0)}
                                </div>
                                <p className="font-semibold text-slate-900">{specialistName}</p>
                            </div>
                        </div>
                    )}

                    {data.emergencyResponseTime && (
                        <div className="flex items-center gap-2 bg-red-50 text-red-600 rounded-xl px-4 py-3 font-bold text-sm">
                            <Clock className="w-4 h-4" /> Ambulance ETA: {data.emergencyResponseTime} mins
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <button onClick={onBack}
                            className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 cursor-pointer transition-colors">
                            New Patient
                        </button>
                        <button onClick={() => nav('/patients')}
                            className="flex-1 py-3 rounded-xl text-white font-semibold cursor-pointer"
                            style={{ background: 'linear-gradient(135deg, #0891B2, #164E63)' }}>
                            View Registry
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
