import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE } from '../api/config';
import { HeartPulse, Activity, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

export default function TriageAI() {
    const [form, setForm] = useState({
        fever: false,
        coughDurationDays: 0,
        breathlessness: false,
        unconscious: false,
    });

    const mutation = useMutation({
        mutationFn: async (data) => {
            const res = await axios.post(`${API_BASE}/api/cases/1`, data);
            return res.data;
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate(form);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10">
            <div className="text-center space-y-3">
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary-600">
                    Autonomous <span style={{ color: '#059669' }}>Triage Engine</span>
                </h1>
                <p className="text-slate-600 text-lg">
                    Log patient symptoms — AI routes to the right specialist instantly.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 relative overflow-hidden">
                    <div style={{
                        position: 'absolute', top: 0, right: 0, width: '120px', height: '120px',
                        background: '#ECFEFF', borderBottomLeftRadius: '100%'
                    }} />
                    <h2 className="text-xl font-heading font-bold mb-6 flex items-center gap-2 text-slate-900">
                        <Activity className="w-5 h-5 text-primary-500" /> Patient Symptoms
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Toggle label="High Fever" checked={form.fever}
                            onChange={(v) => setForm({ ...form, fever: v })} />
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700">Cough Duration (days)</label>
                            <input type="number" min="0"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                                value={form.coughDurationDays}
                                onChange={(e) => setForm({ ...form, coughDurationDays: parseInt(e.target.value) || 0 })} />
                        </div>
                        <Toggle label="Breathlessness" checked={form.breathlessness}
                            onChange={(v) => setForm({ ...form, breathlessness: v })} />
                        <Toggle label="Unconscious / Unresponsive" checked={form.unconscious}
                            onChange={(v) => setForm({ ...form, unconscious: v })} />

                        <button type="submit" disabled={mutation.isPending}
                            style={{ background: mutation.isPending ? '#94A3B8' : '#164E63' }}
                            className="w-full py-4 text-white rounded-xl font-bold text-base transition-all active:scale-95 cursor-pointer mt-2">
                            {mutation.isPending ? 'Processing...' : 'Run Triage Engine →'}
                        </button>
                    </form>
                </div>

                {/* Result */}
                <div>
                    {mutation.isIdle && (
                        <div className="h-full min-h-80 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 gap-3">
                            <HeartPulse className="w-10 h-10 opacity-40" />
                            <p className="text-sm">Awaiting patient symptoms...</p>
                        </div>
                    )}

                    {mutation.isError && (
                        <div className="p-6 bg-red-50 border border-red-200 rounded-2xl">
                            <p className="text-red-700 font-semibold">⚠️ Error connecting to backend.</p>
                            <p className="text-red-500 text-sm mt-1">Make sure Spring Boot is running on port 8080.</p>
                        </div>
                    )}

                    {mutation.isSuccess && mutation.data && (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                            {/* Severity color strip */}
                            <div style={{ height: '6px', background: mutation.data.severity === 'EMERGENCY' ? '#EF4444' : mutation.data.severity === 'URGENT' ? '#F97316' : '#059669' }} />

                            <div className="p-8 space-y-5">
                                <div className="flex items-center gap-3">
                                    {mutation.data.severity === 'EMERGENCY'
                                        ? <AlertCircle className="w-8 h-8 text-red-500" />
                                        : <CheckCircle2 className="w-8 h-8 text-green-500" />}
                                    <div>
                                        <h3 className="font-bold text-xl text-slate-900">{mutation.data.severity} Protocol</h3>
                                        <p className="text-sm text-slate-400">Triage Score: {mutation.data.triageScore}/10</p>
                                    </div>
                                </div>

                                <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                                    {[
                                        { label: 'Diagnosis', value: mutation.data.diagnosis },
                                        { label: 'Confidence', value: mutation.data.confidence ? `${mutation.data.confidence}%` : null },
                                        { label: 'Action', value: mutation.data.recommendedAction },
                                    ].filter(r => r.value).map(row => (
                                        <div key={row.label} className="flex justify-between text-sm">
                                            <span className="text-slate-500">{row.label}</span>
                                            <span className="font-semibold text-slate-900">{row.value}</span>
                                        </div>
                                    ))}
                                </div>

                                {mutation.data.assignedSpecialist && (
                                    <div className="border-t border-slate-100 pt-4">
                                        <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-3">Assigned Specialist</p>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-cyan-100 text-primary-600 flex items-center justify-center font-bold text-lg">
                                                {mutation.data.assignedSpecialist.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900">{mutation.data.assignedSpecialist.name}</p>
                                                <p className="text-sm text-slate-500">{mutation.data.assignedSpecialist.specialty} · {mutation.data.assignedSpecialist.language}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {mutation.data.emergencyResponseTimeMinutes && (
                                    <div className="flex items-center gap-2 bg-red-50 text-red-600 rounded-xl px-4 py-3 font-bold text-sm">
                                        <Clock className="w-4 h-4" /> Ambulance ETA: {mutation.data.emergencyResponseTimeMinutes} mins
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function Toggle({ label, checked, onChange }) {
    return (
        <label className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors">
            <span className="font-medium text-slate-800">{label}</span>
            <div onClick={() => onChange(!checked)}
                style={{ background: checked ? '#0891B2' : '#CBD5E1', transition: 'background 0.2s' }}
                className="relative w-11 h-6 rounded-full flex-shrink-0">
                <div style={{
                    position: 'absolute', top: '4px', left: checked ? '22px' : '4px',
                    width: '16px', height: '16px', background: 'white', borderRadius: '50%', transition: 'left 0.2s'
                }} />
            </div>
        </label>
    );
}
