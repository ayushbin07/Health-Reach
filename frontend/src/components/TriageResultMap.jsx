import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AlertCircle, CheckCircle2, Clock, Users, ChevronRight, ArrowLeft, RefreshCw } from 'lucide-react';

/* ─── Fix Leaflet default icon paths (broken in Vite by default) ───── */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

/* ─── District Coordinates (Maharashtra / mocked nearby) ────────────── */
const DISTRICT_COORDS = {
    Bangalore: [12.9716, 77.5946],
    Palghar: [19.6967, 72.7697],
    Mumbai: [19.0760, 72.8777],
    Pune: [18.5204, 73.8567],
    Nashik: [19.9975, 73.7898],
    Nagpur: [21.1458, 79.0882],
    Thane: [19.2183, 72.9781],
    Aurangabad: [19.8762, 75.3433],
    Solapur: [17.6805, 75.9064],
    Kolhapur: [16.7050, 74.2433],
    Nanded: [19.1383, 77.3210],
};

/* ─── Mock doctor pool (each has a position slightly offset from district) */
const MOCK_DOCTORS = [
    { name: 'Dr. Sharma', specialty: 'General Medicine', language: 'Hindi', available: true, eta: 12, colorClass: '#059669', rating: 4.9 },
    { name: 'Dr. Iyer', specialty: 'Pulmonology', language: 'Tamil', available: true, eta: 18, colorClass: '#0891B2', rating: 4.8 },
    { name: 'Dr. Khan', specialty: 'Emergency Medicine', language: 'Hindi', available: true, eta: 8, colorClass: '#DC2626', rating: 4.9 },
    { name: 'Dr. Banerjee', specialty: 'Infectious Disease', language: 'Bengali', available: true, eta: 22, colorClass: '#7C3AED', rating: 4.7 },
    { name: 'Dr. Patil', specialty: 'General Medicine', language: 'Marathi', available: false, eta: 35, colorClass: '#059669', rating: 4.6 },
    { name: 'Dr. Reddy', specialty: 'Internal Medicine', language: 'Telugu', available: true, eta: 15, colorClass: '#0891B2', rating: 4.8 },
    { name: 'Dr. Singh', specialty: 'Pulmonology', language: 'Punjabi', available: true, eta: 20, colorClass: '#0891B2', rating: 4.5 },
    { name: 'Dr. Nair', specialty: 'Emergency Medicine', language: 'Malayalam', available: true, eta: 10, colorClass: '#DC2626', rating: 4.9 },
    { name: 'Dr. Desai', specialty: 'General Medicine', language: 'Gujarati', available: true, eta: 14, colorClass: '#059669', rating: 4.7 },
    { name: 'Dr. Das', specialty: 'Infectious Disease', language: 'Odia', available: true, eta: 25, colorClass: '#7C3AED', rating: 4.6 },
];

/* ─── Custom SVG icons ───────────────────────────────────────────────── */
const makeDocIcon = (color, size = 32) => L.divIcon({
    className: '',
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
    html: `<div style="
    width:${size}px;height:${size}px;border-radius:50%;
    background:${color};border:3px solid white;
    box-shadow:0 2px 8px rgba(0,0,0,0.3);
    display:flex;align-items:center;justify-content:center;
    font-size:13px;font-weight:bold;color:white;
  ">👨‍⚕️</div>`,
});

const patientIcon = L.divIcon({
    className: '',
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    html: `<div style="
    width:32px;height:32px;border-radius:50%;
    background:#F97316;border:3px solid white;
    box-shadow:0 2px 8px rgba(0,0,0,0.3);
    display:flex;align-items:center;justify-content:center;
    font-size:14px;
  ">🧑</div>`,
});

/* ─── Map auto-fit ─────────────────────────────────────────────────── */
function FitBounds({ positions }) {
    const map = useMap();
    useEffect(() => {
        if (positions.length >= 2) {
            map.fitBounds(positions, { padding: [60, 60], maxZoom: 13 });
        }
    }, []);
    return null;
}

/* ─── Doctor offset from patient (randomised but stable) ───────────── */
function doctorPos(base, idx) {
    const offsets = [
        [0.08, 0.12], [-0.06, 0.15], [0.14, -0.08],
        [-0.12, -0.10], [0.05, -0.14], [0.18, 0.06],
    ];
    const [dlat, dlng] = offsets[idx % offsets.length];
    return [base[0] + dlat, base[1] + dlng];
}

/* ─── Main Component ─────────────────────────────────────────────────── */
export default function TriageResultMap({ caseData, district, patientName, onBack }) {
    const nav = useNavigate();
    const [selectedIdx, setSelectedIdx] = useState(0);  // 0 = assigned, 1 = alternative

    const severity = caseData.severity?.toUpperCase();
    const isCritical = severity === 'EMERGENCY';
    const accentColor = isCritical ? '#DC2626' : severity === 'URGENT' ? '#F97316' : '#059669';

    const patientCoords = DISTRICT_COORDS[district] || DISTRICT_COORDS['Palghar'];

    // Pick assigned + alternative from mock pool based on action string
    const specialistMatch = caseData.action?.match(/ASSIGNED_TO_Dr\._(\w+)/);
    const assignedName = specialistMatch ? `Dr. ${specialistMatch[1]}` : null;
    const primaryDoc = MOCK_DOCTORS.find(d => d.name === assignedName) || MOCK_DOCTORS[0];
    const altDoc = MOCK_DOCTORS.find(d => d.name !== primaryDoc.name && d.available) || MOCK_DOCTORS[1];
    const doctors = [primaryDoc, altDoc];
    const activeDoc = doctors[selectedIdx];

    const docCoords = doctorPos(patientCoords, selectedIdx);
    const routeCoords = [patientCoords, docCoords];

    return (
        <div style={{ minHeight: '100vh', background: '#F0FDFF', fontFamily: "'Source Sans 3', system-ui, sans-serif" }}>
            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>

                {/* ── Back ─────────────────────────────────────────── */}
                <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 600, color: '#475569', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 28 }}>
                    <ArrowLeft size={16} /> New Patient
                </button>

                {/* ── Triage result banner ──────────────────────────── */}
                <div style={{ backgroundColor: 'white', borderRadius: 18, border: `1.5px solid ${accentColor}30`, marginBottom: 28, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                    <div style={{ height: 5, background: accentColor }} />
                    <div style={{ padding: '20px 28px', display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            {isCritical
                                ? <AlertCircle size={32} color={accentColor} />
                                : <CheckCircle2 size={32} color={accentColor} />}
                            <div>
                                <p style={{ fontFamily: "'Lexend', sans-serif", fontSize: 20, fontWeight: 800, color: '#0C3547' }}>
                                    {caseData.severity} Protocol
                                </p>
                                <p style={{ fontSize: 13, color: '#64748B' }}>
                                    Triage Score: <strong>{caseData.triageScore}</strong>/10
                                    {caseData.diagnosis && ` · ${caseData.diagnosis}`}
                                    {caseData.confidence && ` · ${(caseData.confidence * 100).toFixed(0)}% confidence`}
                                </p>
                            </div>
                        </div>
                        {caseData.emergencyResponseTime && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#FEF2F2', color: '#DC2626', padding: '10px 18px', borderRadius: 10, fontWeight: 700, fontSize: 14 }}>
                                <Clock size={16} /> Ambulance ETA: {caseData.emergencyResponseTime} mins
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Main grid: Map + Doctor panel ─────────────────── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>

                    {/* MAP */}
                    <div style={{ background: 'white', borderRadius: 18, overflow: 'hidden', border: '1.5px solid #E2E8F0', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', height: 480 }}>
                        <div style={{ padding: '14px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <p style={{ fontFamily: "'Lexend', sans-serif", fontWeight: 700, fontSize: 15, color: '#0C3547' }}>
                                📍 {district} — Doctor Dispatch Map
                            </p>
                            <span style={{ fontSize: 12, background: '#ECFDF5', color: '#059669', padding: '4px 10px', borderRadius: 20, fontWeight: 700 }}>
                                ● Live Routing
                            </span>
                        </div>
                        <MapContainer
                            center={patientCoords}
                            zoom={12}
                            style={{ height: 'calc(100% - 53px)', width: '100%' }}
                            zoomControl={true}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <FitBounds positions={routeCoords} />

                            {/* Patient marker */}
                            <Marker position={patientCoords} icon={patientIcon}>
                                <Popup>
                                    <strong>🧑 {patientName || 'Patient'}</strong><br />
                                    District: {district}<br />
                                    Severity: {caseData.severity}
                                </Popup>
                            </Marker>

                            {/* Assigned / Alternative doctor marker */}
                            <Marker position={docCoords} icon={makeDocIcon(activeDoc.colorClass)}>
                                <Popup>
                                    <strong>👨‍⚕️ {activeDoc.name}</strong><br />
                                    {activeDoc.specialty}<br />
                                    Language: {activeDoc.language}<br />
                                    ETA: {activeDoc.eta} mins
                                </Popup>
                            </Marker>

                            {/* Dashed route line */}
                            <Polyline
                                positions={routeCoords}
                                pathOptions={{ color: activeDoc.colorClass, weight: 3, dashArray: '8,6', opacity: 0.85 }}
                            />
                        </MapContainer>
                    </div>

                    {/* DOCTOR PANEL */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                        {/* Doctor cards */}
                        {doctors.map((doc, idx) => (
                            <div key={doc.name}
                                onClick={() => setSelectedIdx(idx)}
                                style={{ background: 'white', borderRadius: 16, padding: '20px', border: selectedIdx === idx ? `2px solid ${doc.colorClass}` : '1.5px solid #E2E8F0', cursor: 'pointer', transition: 'box-shadow 0.15s', boxShadow: selectedIdx === idx ? `0 4px 20px ${doc.colorClass}22` : '0 1px 6px rgba(0,0,0,0.04)' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${doc.colorClass}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                                            👨‍⚕️
                                        </div>
                                        <div>
                                            <p style={{ fontFamily: "'Lexend', sans-serif", fontWeight: 700, fontSize: 15, color: '#0C3547' }}>{doc.name}</p>
                                            <p style={{ fontSize: 12, color: '#64748B' }}>{doc.specialty}</p>
                                        </div>
                                    </div>
                                    {idx === 0 && (
                                        <span style={{ fontSize: 10, fontWeight: 800, background: doc.colorClass, color: 'white', padding: '3px 8px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                                            Assigned
                                        </span>
                                    )}
                                    {idx === 1 && (
                                        <span style={{ fontSize: 10, fontWeight: 800, background: '#F1F5F9', color: '#64748B', padding: '3px 8px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                                            Alternative
                                        </span>
                                    )}
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 13 }}>
                                    <Info label="Language" value={doc.language} />
                                    <Info label="ETA" value={`${doc.eta} mins`} />
                                    <Info label="Rating" value={`⭐ ${doc.rating}`} />
                                    <Info label="Status" value={doc.available ? '✅ Available' : '⏳ Busy'} />
                                </div>

                                {selectedIdx === idx && (
                                    <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid #F1F5F9' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: doc.colorClass, fontWeight: 700 }}>
                                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: doc.colorClass }} />
                                            Shown on map · Routing active
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Patient goes back to register another — no access to DB views */}
                        <button onClick={onBack}
                            style={{ padding: '14px', borderRadius: 14, background: 'linear-gradient(135deg, #0891B2, #164E63)', color: 'white', fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                            Register Another Patient <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Info({ label, value }) {
    return (
        <div style={{ background: '#F8FAFC', borderRadius: 8, padding: '8px 10px' }}>
            <p style={{ fontSize: 10, color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', marginBottom: 2 }}>{label}</p>
            <p style={{ fontWeight: 600, color: '#334155' }}>{value}</p>
        </div>
    );
}
