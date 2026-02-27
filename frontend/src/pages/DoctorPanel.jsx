import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE } from '../api/config';
import {
    ShieldPlus, AlertCircle, Clock, CheckCircle2,
    Activity, Users, BarChart2, LogOut, RefreshCw, ChevronRight
} from 'lucide-react';

/* ─── Mock doctor roster (matches data.sql specialists) ─────────────── */
const DOCTORS = [
    { name: 'Dr. Khan', specialty: 'Emergency Medicine', languages: 'Hindi' },
    { name: 'Dr. Sharma', specialty: 'General Medicine', languages: 'Hindi' },
    { name: 'Dr. Nair', specialty: 'Emergency Medicine', languages: 'Malayalam' },
    { name: 'Dr. Iyer', specialty: 'Pulmonology', languages: 'Tamil' },
    { name: 'Dr. Reddy', specialty: 'Internal Medicine', languages: 'Telugu' },
    { name: 'Dr. Banerjee', specialty: 'Infectious Disease', languages: 'Bengali' },
    { name: 'Dr. Patil', specialty: 'General Medicine', languages: 'Marathi' },
    { name: 'Dr. Desai', specialty: 'General Medicine', languages: 'Gujarati' },
    { name: 'Dr. Singh', specialty: 'Pulmonology', languages: 'Punjabi' },
    { name: 'Dr. Das', specialty: 'Infectious Disease', languages: 'Odia' },
];

/* ─── Severity helpers ─────────────────────────────────────────────── */
const SEV = {
    Emergency: { color: '#DC2626', bg: '#FEF2F2', icon: <AlertCircle size={14} /> },
    Urgent: { color: '#F97316', bg: '#FFF7ED', icon: <Clock size={14} /> },
    Routine: { color: '#059669', bg: '#ECFDF5', icon: <CheckCircle2 size={14} /> },
};

const getBadge = (sev) => SEV[sev] || SEV.Routine;

/* ─── Panel ─────────────────────────────────────────────────────────── */
export default function DoctorPanel() {
    const nav = useNavigate();
    const [doctor, setDoctor] = useState(null);  // null = login screen

    if (!doctor) return <DoctorLogin onLogin={setDoctor} />;
    return <DashboardView doctor={doctor} onLogout={() => setDoctor(null)} nav={nav} />;
}

/* ─── Login / Doctor selector ──────────────────────────────────────── */
function DoctorLogin({ onLogin }) {
    const nav = useNavigate();
    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #F0FDFF 0%, #fff 60%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', fontFamily: "'Source Sans 3', system-ui, sans-serif" }}>

            {/* Back */}
            <button onClick={() => nav('/role')} style={{ position: 'absolute', top: 28, left: 28, fontSize: 14, fontWeight: 600, color: '#475569', background: 'none', border: 'none', cursor: 'pointer' }}>
                ← Back
            </button>

            <div style={{ maxWidth: 480, width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #0891B2, #164E63)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                        <ShieldPlus size={26} color="white" />
                    </div>
                    <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#0891B2', marginBottom: 8 }}>+ DOCTOR LOGIN</p>
                    <h1 style={{ fontFamily: "'Lexend', sans-serif", fontSize: 28, fontWeight: 800, color: '#0C3547' }}>Select Your Profile</h1>
                    <p style={{ fontSize: 14.5, color: '#475569', marginTop: 8 }}>Choose your doctor profile to enter the panel</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: '55vh', overflowY: 'auto', paddingRight: 4 }}>
                    {DOCTORS.map(doc => (
                        <button key={doc.name} onClick={() => onLogin(doc)}
                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: 'white', border: '1.5px solid #E2E8F0', borderRadius: 14, cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.15s, box-shadow 0.15s' }}
                            onMouseOver={e => { e.currentTarget.style.borderColor = '#0891B2'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(8,145,178,0.12)'; }}
                            onMouseOut={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.boxShadow = 'none'; }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#EFF9FC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>👨‍⚕️</div>
                                <div>
                                    <p style={{ fontFamily: "'Lexend', sans-serif", fontWeight: 700, fontSize: 15, color: '#0C3547' }}>{doc.name}</p>
                                    <p style={{ fontSize: 12.5, color: '#64748B' }}>{doc.specialty} · {doc.languages}</p>
                                </div>
                            </div>
                            <ChevronRight size={18} color="#94A3B8" />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ─── Main dashboard view ──────────────────────────────────────────── */
function DashboardView({ doctor, onLogout, nav }) {
    const { data: patients = [], isFetching, refetch } = useQuery({
        queryKey: ['all-patients'],
        queryFn: () => axios.get(`${API_BASE}/api/patients`).then(r => r.data),
        refetchInterval: 8000,
    });

    const { data: summary } = useQuery({
        queryKey: ['case-summary'],
        queryFn: () => axios.get(`${API_BASE}/api/analytics/case-summary`).then(r => r.data),
        refetchInterval: 8000,
    });

    const stats = [
        { label: 'Total Cases', value: summary?.totalCases ?? '—', color: '#0891B2', icon: <Users size={18} /> },
        { label: 'Emergency', value: summary?.emergencyCases ?? '—', color: '#DC2626', icon: <AlertCircle size={18} /> },
        { label: 'Urgent', value: summary?.urgentCases ?? '—', color: '#F97316', icon: <Clock size={18} /> },
        { label: 'Routine', value: summary?.routineCases ?? '—', color: '#059669', icon: <CheckCircle2 size={18} /> },
    ];

    // Sort: Emergency first, then Urgent, then Routine
    const SORT_ORDER = { Emergency: 0, Urgent: 1, Routine: 2 };
    const sorted = [...patients].sort((a, b) =>
        (SORT_ORDER[a.severity] ?? 3) - (SORT_ORDER[b.severity] ?? 3)
    );

    return (
        <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: "'Source Sans 3', system-ui, sans-serif" }}>

            {/* ── Top Nav ────────────────────────────────────────────── */}
            <header style={{ background: 'white', borderBottom: '1px solid #E2E8F0', padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 40 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, #0891B2, #164E63)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ShieldPlus size={16} color="white" />
                    </div>
                    <div>
                        <p style={{ fontFamily: "'Lexend', sans-serif", fontWeight: 700, fontSize: 14, color: '#0C3547', lineHeight: 1 }}>Welcome, {doctor.name}</p>
                        <p style={{ fontSize: 11.5, color: '#64748B', marginTop: 2 }}>{doctor.specialty} · {doctor.languages}</p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: isFetching ? '#F97316' : '#059669', fontWeight: 600 }}>
                        <RefreshCw size={13} style={{ animation: isFetching ? 'spin 1s linear infinite' : 'none' }} />
                        {isFetching ? 'Syncing...' : 'Live'}
                    </div>
                    <button onClick={() => nav('/analytics')}
                        style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, background: '#F1F5F9', color: '#475569', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                        <BarChart2 size={14} /> Analytics
                    </button>
                    <button onClick={onLogout}
                        style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, background: 'none', color: '#94A3B8', border: '1px solid #E2E8F0', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                        <LogOut size={14} /> Switch
                    </button>
                </div>
            </header>

            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>

                {/* ── Stats strip ────────────────────────────────────────── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
                    {stats.map(s => (
                        <div key={s.label} style={{ background: 'white', borderRadius: 16, padding: '20px 22px', border: '1.5px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 14 }}>
                            <div style={{ width: 42, height: 42, borderRadius: 12, background: `${s.color}15`, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {s.icon}
                            </div>
                            <div>
                                <p style={{ fontFamily: "'Lexend', sans-serif", fontSize: 24, fontWeight: 800, color: '#0C3547', lineHeight: 1 }}>{s.value}</p>
                                <p style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>{s.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Patient list ────────────────────────────────────────── */}
                <div style={{ background: 'white', borderRadius: 18, border: '1.5px solid #E2E8F0', overflow: 'hidden' }}>
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h2 style={{ fontFamily: "'Lexend', sans-serif", fontSize: 17, fontWeight: 700, color: '#0C3547' }}>Patient Queue</h2>
                            <p style={{ fontSize: 13, color: '#64748B', marginTop: 2 }}>Sorted by severity · Auto-refreshes every 8s</p>
                        </div>
                        <button onClick={() => refetch()}
                            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, background: '#F1F5F9', color: '#475569', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                            <RefreshCw size={13} /> Refresh
                        </button>
                    </div>

                    {sorted.length === 0 ? (
                        <div style={{ padding: '60px 24px', textAlign: 'center', color: '#94A3B8' }}>
                            <Activity size={40} style={{ marginBottom: 12, opacity: 0.4 }} />
                            <p style={{ fontSize: 15 }}>No patients yet. Restart Spring Boot to load mock data.</p>
                        </div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#F8FAFC' }}>
                                    {['Patient', 'Age / Gender', 'District', 'Language', 'Severity', 'Registered'].map(h => (
                                        <th key={h} style={{ padding: '11px 20px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#94A3B8', textAlign: 'left' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {sorted.map((p, i) => {
                                    const badge = getBadge(p.severity);
                                    const time = p.createdAt ? new Date(p.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '—';
                                    const date = p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '';
                                    return (
                                        <tr key={p.id} style={{ borderTop: '1px solid #F1F5F9', background: i % 2 === 0 ? 'white' : '#FAFAFA' }}>
                                            <td style={{ padding: '14px 20px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#EFF9FC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
                                                        {p.gender === 'Female' ? '👩' : '👨'}
                                                    </div>
                                                    <div>
                                                        <p style={{ fontWeight: 700, fontSize: 14, color: '#0C3547' }}>{p.name}</p>
                                                        <p style={{ fontSize: 11.5, color: '#94A3B8' }}>ID #{p.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '14px 20px', fontSize: 13.5, color: '#334155' }}>{p.age}y · {p.gender || '—'}</td>
                                            <td style={{ padding: '14px 20px', fontSize: 13.5, color: '#334155' }}>{p.district}</td>
                                            <td style={{ padding: '14px 20px', fontSize: 13.5, color: '#334155' }}>{p.language}</td>
                                            <td style={{ padding: '14px 20px' }}>
                                                {p.severity ? (
                                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 20, background: badge.bg, color: badge.color }}>
                                                        {badge.icon} {p.severity}
                                                    </span>
                                                ) : (
                                                    <span style={{ fontSize: 12, color: '#94A3B8' }}>Pending</span>
                                                )}
                                            </td>
                                            <td style={{ padding: '14px 20px', fontSize: 12.5, color: '#64748B' }}>{date} {time}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
        </div>
    );
}
