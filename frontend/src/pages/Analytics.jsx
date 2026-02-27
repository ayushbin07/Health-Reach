import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { API_BASE } from '../api/config';
import {
    ShieldPlus, AlertTriangle, Activity, BarChart2,
    Users, Clock, CheckCircle2, AlertCircle, ArrowLeft, RefreshCw
} from 'lucide-react';

/* ─── Disease color palette ────────────────────────────────────────── */
const DISEASE = {
    'Viral Fever': { color: '#F97316', label: 'Viral Fever' },
    'Tuberculosis (TB)': { color: '#7C3AED', label: 'Tuberculosis (TB)' },
    'Pneumonia': { color: '#0891B2', label: 'Pneumonia' },
    'Malaria': { color: '#059669', label: 'Malaria' },
    'Dengue': { color: '#EF4444', label: 'Dengue' },
    'Emergency': { color: '#DC2626', label: 'Emergency / Critical' },
    'Unknown': { color: '#94A3B8', label: 'Undiagnosed' },
};

/* ─── District coordinates (matches dropdown list) ─────────────────── */
const DISTRICTS = {
    Bangalore: { lat: 12.9716, lng: 77.5946 },
    Palghar: { lat: 19.6967, lng: 72.7697 },
    Mumbai: { lat: 19.0760, lng: 72.8777 },
    Pune: { lat: 18.5204, lng: 73.8567 },
    Nashik: { lat: 19.9975, lng: 73.7898 },
    Nagpur: { lat: 21.1458, lng: 79.0882 },
    Thane: { lat: 19.2183, lng: 72.9781 },
    Aurangabad: { lat: 19.8762, lng: 75.3433 },
    Solapur: { lat: 17.6805, lng: 75.9064 },
    Kolhapur: { lat: 16.7050, lng: 74.2433 },
    Nanded: { lat: 19.1383, lng: 77.3210 },
};

/* ─── Mock district disease data (realistic for demo) ──────────────── */
const DISTRICT_DATA = {
    Bangalore: { 'Viral Fever': 14, 'Dengue': 7, 'Pneumonia': 3 },   // Outbreak
    Mumbai: { 'Viral Fever': 8, 'Pneumonia': 13, 'Malaria': 5 },   // Outbreak
    Pune: { 'Viral Fever': 6, 'Dengue': 4 },
    Nashik: { 'Tuberculosis (TB)': 12, 'Viral Fever': 3 },          // Outbreak
    Nagpur: { 'Malaria': 16, 'Viral Fever': 2 },                    // Outbreak
    Thane: { 'Viral Fever': 9, 'Dengue': 6 },
    Aurangabad: { 'Tuberculosis (TB)': 4, 'Viral Fever': 5 },
    Solapur: { 'Malaria': 8, 'Viral Fever': 3 },
    Kolhapur: { 'Pneumonia': 6, 'Viral Fever': 4 },
    Nanded: { 'Tuberculosis (TB)': 5, 'Malaria': 3 },
    Palghar: { 'Viral Fever': 7, 'Dengue': 2 },
};

const OUTBREAK_THRESHOLD = 10;

function topDisease(data) {
    return Object.entries(data).sort(([, a], [, b]) => b - a)[0];
}

function totalCases(data) {
    return Object.values(data).reduce((s, v) => s + v, 0);
}

function isOutbreak(data) {
    return Object.values(data).some(v => v >= OUTBREAK_THRESHOLD);
}

/* ─── Component ─────────────────────────────────────────────────────── */
export default function Analytics() {
    const nav = useNavigate();
    const [selectedDistrict, setSelectedDistrict] = useState(null);

    const { data: summary, isFetching, refetch } = useQuery({
        queryKey: ['case-summary'],
        queryFn: () => axios.get(`${API_BASE}/api/analytics/case-summary`).then(r => r.data),
        refetchInterval: 10000,
    });

    const outbreakDistricts = Object.entries(DISTRICT_DATA).filter(([, d]) => isOutbreak(d));
    const totalAllCases = Object.values(DISTRICT_DATA).reduce((s, d) => s + totalCases(d), 0);

    return (
        <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: "'Source Sans 3', system-ui, sans-serif" }}>

            {/* ── Sticky Header ────────────────────────────────────────── */}
            <header style={{ background: 'white', borderBottom: '1px solid #E2E8F0', padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 40 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button onClick={() => nav('/doctor')} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: '#64748B', background: 'none', border: 'none', cursor: 'pointer' }}>
                        <ArrowLeft size={15} /> Doctor Panel
                    </button>
                    <span style={{ color: '#E2E8F0' }}>|</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #0891B2, #164E63)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ShieldPlus size={14} color="white" />
                        </div>
                        <span style={{ fontFamily: "'Lexend', sans-serif", fontWeight: 700, fontSize: 15, color: '#0C3547' }}>HealthReach</span>
                        <span style={{ fontSize: 12, background: '#EFF9FC', color: '#0891B2', padding: '2px 8px', borderRadius: 10, fontWeight: 700 }}>GOV ANALYTICS</span>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: isFetching ? '#F97316' : '#059669', fontWeight: 600 }}>
                        <RefreshCw size={12} style={{ animation: isFetching ? 'spin 1s linear infinite' : 'none' }} />
                        {isFetching ? 'Syncing...' : 'Live'}
                    </div>
                    <button onClick={() => refetch()} style={{ padding: '7px 14px', borderRadius: 8, background: '#F1F5F9', color: '#475569', border: 'none', cursor: 'pointer', fontSize: 12.5, fontWeight: 600 }}>
                        Refresh
                    </button>
                </div>
            </header>

            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 28px' }}>

                {/* ── Outbreak Alert Banner ─────────────────────────────── */}
                {outbreakDistricts.length > 0 && (
                    <div style={{ background: '#FEF2F2', border: '1.5px solid #FECACA', borderRadius: 14, padding: '14px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                        <AlertTriangle size={20} color="#DC2626" style={{ flexShrink: 0 }} />
                        <div>
                            <p style={{ fontFamily: "'Lexend', sans-serif", fontWeight: 700, fontSize: 14, color: '#DC2626' }}>
                                ⚠ Active Outbreak Alert — {outbreakDistricts.length} district(s) exceed threshold
                            </p>
                            <p style={{ fontSize: 12.5, color: '#991B1B', marginTop: 2 }}>
                                {outbreakDistricts.map(([d, data]) => {
                                    const [disease, count] = topDisease(data);
                                    return `${d}: ${disease} (${count} cases)`;
                                }).join(' · ')}
                            </p>
                        </div>
                    </div>
                )}

                {/* ── Top Stats ─────────────────────────────────────────── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, marginBottom: 24 }}>
                    {[
                        { label: 'Total Cases', value: summary?.totalCases ?? totalAllCases, color: '#0891B2', icon: <Activity size={16} /> },
                        { label: 'Emergency', value: summary?.emergencyCases ?? 3, color: '#DC2626', icon: <AlertCircle size={16} /> },
                        { label: 'Urgent', value: summary?.urgentCases ?? 3, color: '#F97316', icon: <Clock size={16} /> },
                        { label: 'Routine', value: summary?.routineCases ?? 4, color: '#059669', icon: <CheckCircle2 size={16} /> },
                        { label: 'Active Outbreaks', value: outbreakDistricts.length, color: '#7C3AED', icon: <AlertTriangle size={16} /> },
                    ].map(s => (
                        <div key={s.label} style={{ background: 'white', borderRadius: 14, padding: '18px 20px', border: '1.5px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 38, height: 38, borderRadius: 10, background: `${s.color}15`, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                {s.icon}
                            </div>
                            <div>
                                <p style={{ fontFamily: "'Lexend', sans-serif", fontSize: 22, fontWeight: 800, color: '#0C3547', lineHeight: 1 }}>{s.value}</p>
                                <p style={{ fontSize: 11, color: '#64748B', marginTop: 3 }}>{s.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Main content: Map + Sidebar ───────────────────────── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>

                    {/* MAP */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div style={{ background: 'white', borderRadius: 18, overflow: 'hidden', border: '1.5px solid #E2E8F0', height: 480 }}>
                            <div style={{ padding: '14px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <p style={{ fontFamily: "'Lexend', sans-serif", fontWeight: 700, fontSize: 15, color: '#0C3547' }}>
                                    Disease Distribution — Active Districts
                                </p>
                                <span style={{ fontSize: 11.5, color: '#64748B' }}>Click a node for details</span>
                            </div>
                            <MapContainer center={[18.5, 75.5]} zoom={7} style={{ height: 'calc(100% - 53px)', width: '100%' }} zoomControl>
                                <TileLayer
                                    attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                {Object.entries(DISTRICT_DATA).map(([district, data]) => {
                                    const coords = DISTRICTS[district];
                                    if (!coords) return null;
                                    const [disease, count] = topDisease(data);
                                    const outbreak = isOutbreak(data);
                                    const diseaseInfo = DISEASE[disease] || DISEASE['Unknown'];
                                    const total = totalCases(data);
                                    const radius = Math.max(10, Math.min(30, total * 1.4));

                                    return (
                                        <CircleMarker
                                            key={district}
                                            center={[coords.lat, coords.lng]}
                                            radius={radius}
                                            pathOptions={{
                                                fillColor: diseaseInfo.color,
                                                fillOpacity: 0.82,
                                                color: outbreak ? '#DC2626' : 'white',
                                                weight: outbreak ? 3 : 2,
                                            }}
                                            eventHandlers={{ click: () => setSelectedDistrict(district) }}
                                        >
                                            <Popup>
                                                <div style={{ fontFamily: 'system-ui', minWidth: 180 }}>
                                                    <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{district}</p>
                                                    {outbreak && (
                                                        <p style={{ color: '#DC2626', fontWeight: 700, fontSize: 12, marginBottom: 6 }}>
                                                            ⚠ OUTBREAK DETECTED
                                                        </p>
                                                    )}
                                                    {Object.entries(data).map(([d, count]) => (
                                                        <div key={d} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, fontSize: 12, marginBottom: 3 }}>
                                                            <span style={{ color: DISEASE[d]?.color || '#94A3B8' }}>● {d}</span>
                                                            <strong>{count} cases</strong>
                                                        </div>
                                                    ))}
                                                    <p style={{ marginTop: 6, fontSize: 11, color: '#64748B' }}>Total: {total} cases</p>
                                                </div>
                                            </Popup>
                                        </CircleMarker>
                                    );
                                })}
                            </MapContainer>
                        </div>

                        {/* ── Disease Legend ─────────────────────────────────── */}
                        <div style={{ background: 'white', borderRadius: 16, padding: '16px 20px', border: '1.5px solid #E2E8F0' }}>
                            <p style={{ fontFamily: "'Lexend', sans-serif", fontSize: 13, fontWeight: 700, color: '#0C3547', marginBottom: 12 }}>Disease Legend</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 24px' }}>
                                {Object.entries(DISEASE).map(([key, d]) => (
                                    <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
                                        <span style={{ fontSize: 12.5, color: '#475569' }}>{d.label}</span>
                                    </div>
                                ))}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                                    <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'transparent', border: '2.5px solid #DC2626', flexShrink: 0 }} />
                                    <span style={{ fontSize: 12.5, color: '#DC2626', fontWeight: 600 }}>Outbreak (≥{OUTBREAK_THRESHOLD} cases)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── RIGHT SIDEBAR ──────────────────────────────────────── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                        {/* Outbreak districts */}
                        <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #E2E8F0', overflow: 'hidden' }}>
                            <div style={{ padding: '14px 18px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <AlertTriangle size={15} color="#DC2626" />
                                <p style={{ fontFamily: "'Lexend', sans-serif", fontSize: 14, fontWeight: 700, color: '#0C3547' }}>Outbreak Alerts</p>
                            </div>
                            {outbreakDistricts.length === 0 ? (
                                <p style={{ padding: '20px 18px', fontSize: 13, color: '#94A3B8' }}>No active outbreaks</p>
                            ) : (
                                <div style={{ padding: '10px 0' }}>
                                    {outbreakDistricts.map(([district, data]) => {
                                        const [disease, count] = topDisease(data);
                                        const info = DISEASE[disease] || DISEASE['Unknown'];
                                        return (
                                            <div key={district}
                                                onClick={() => setSelectedDistrict(district)}
                                                style={{ padding: '10px 18px', cursor: 'pointer', borderBottom: '1px solid #F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                                onMouseOver={e => e.currentTarget.style.background = '#FEF2F2'}
                                                onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                                            >
                                                <div>
                                                    <p style={{ fontWeight: 700, fontSize: 13.5, color: '#0C3547' }}>{district}</p>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 3 }}>
                                                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: info.color }} />
                                                        <p style={{ fontSize: 12, color: '#64748B' }}>{disease}</p>
                                                    </div>
                                                </div>
                                                <span style={{ fontSize: 12, fontWeight: 800, background: '#FEF2F2', color: '#DC2626', padding: '4px 10px', borderRadius: 20 }}>
                                                    {count} cases
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* District disease breakdown */}
                        <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #E2E8F0', overflow: 'hidden', flex: 1 }}>
                            <div style={{ padding: '14px 18px', borderBottom: '1px solid #F1F5F9' }}>
                                <p style={{ fontFamily: "'Lexend', sans-serif", fontSize: 14, fontWeight: 700, color: '#0C3547' }}>
                                    {selectedDistrict ? `${selectedDistrict} — Breakdown` : 'District Case Load'}
                                </p>
                                {selectedDistrict && (
                                    <button onClick={() => setSelectedDistrict(null)} style={{ fontSize: 11, color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer', marginTop: 2 }}>
                                        ← Back to all districts
                                    </button>
                                )}
                            </div>
                            <div style={{ padding: '10px 0', maxHeight: 340, overflowY: 'auto' }}>
                                {(selectedDistrict
                                    ? [[selectedDistrict, DISTRICT_DATA[selectedDistrict]]]
                                    : Object.entries(DISTRICT_DATA).sort(([, a], [, b]) => totalCases(b) - totalCases(a))
                                ).map(([name, data]) => {
                                    const total = totalCases(data);
                                    const outbreak = isOutbreak(data);
                                    return (
                                        <div key={name}
                                            onClick={() => setSelectedDistrict(name)}
                                            style={{ padding: '10px 18px', borderBottom: '1px solid #F8FAFC', cursor: 'pointer' }}
                                            onMouseOver={e => e.currentTarget.style.background = '#F8FAFC'}
                                            onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                    <p style={{ fontSize: 13.5, fontWeight: 700, color: '#0C3547' }}>{name}</p>
                                                    {outbreak && <span style={{ fontSize: 10, fontWeight: 800, background: '#FEF2F2', color: '#DC2626', padding: '2px 6px', borderRadius: 10 }}>OUTBREAK</span>}
                                                </div>
                                                <span style={{ fontSize: 12, fontWeight: 600, color: '#64748B' }}>{total} cases</span>
                                            </div>
                                            {/* Mini disease bar */}
                                            <div style={{ display: 'flex', height: 5, borderRadius: 4, overflow: 'hidden', gap: 1 }}>
                                                {Object.entries(data).map(([d, count]) => (
                                                    <div key={d} style={{ flex: count, background: DISEASE[d]?.color || '#94A3B8', minWidth: 2 }} title={`${d}: ${count}`} />
                                                ))}
                                            </div>
                                            {selectedDistrict === name && (
                                                <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
                                                    {Object.entries(data).map(([d, count]) => (
                                                        <div key={d} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: DISEASE[d]?.color || '#94A3B8' }} />
                                                                <span style={{ color: '#475569' }}>{d}</span>
                                                            </div>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                                <span style={{ fontWeight: 700, color: count >= OUTBREAK_THRESHOLD ? '#DC2626' : '#0C3547' }}>{count}</span>
                                                                {count >= OUTBREAK_THRESHOLD && <span style={{ fontSize: 10, color: '#DC2626', fontWeight: 800 }}>⚠</span>}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
        </div>
    );
}
