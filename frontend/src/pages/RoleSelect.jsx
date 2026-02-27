import { useNavigate } from 'react-router-dom';
import { User, Stethoscope, ArrowLeft, ChevronRight } from 'lucide-react';

const C = {
    teal900: '#0C3547',
    teal700: '#164E63',
    teal500: '#0891B2',
    teal100: '#CFFAFE',
    teal50: '#F0FDFF',
    slate600: '#475569',
    white: '#FFFFFF',
};

export default function RoleSelect() {
    const nav = useNavigate();

    return (
        <div style={{ minHeight: '100vh', background: `linear-gradient(160deg, ${C.teal50} 0%, ${C.white} 60%)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', fontFamily: "'Source Sans 3', system-ui, sans-serif" }}>

            {/* Back */}
            <button onClick={() => nav('/')}
                style={{ position: 'absolute', top: 28, left: 28, display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 600, color: C.slate600, background: 'none', border: 'none', cursor: 'pointer' }}>
                <ArrowLeft size={16} /> Back
            </button>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
                <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.teal500, marginBottom: 10 }}>+ ENTER PLATFORM</p>
                <h1 style={{ fontFamily: "'Lexend', sans-serif", fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800, color: C.teal900, lineHeight: 1.2 }}>
                    How are you<br />using HealthReach?
                </h1>
                <p style={{ fontSize: 15, color: C.slate600, marginTop: 12 }}>Choose your role to continue to the right experience.</p>
            </div>

            {/* Cards */}
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
                <RoleCard
                    icon={<User size={28} />}
                    tag="Patient Flow"
                    title="I am a Patient"
                    description="Log your symptoms and let AI route you to the right specialist instantly."
                    accentColor={C.teal500}
                    bgColor="#EFF9FC"
                    onClick={() => nav('/intake')}
                />
                <RoleCard
                    icon={<Stethoscope size={28} />}
                    tag="Doctor / Official"
                    title="I am a Doctor"
                    description="Access the government dashboard, patient registry, and outbreak analytics."
                    accentColor={C.teal700}
                    bgColor="#EFF9FC"
                    onClick={() => nav('/doctor')}
                />
            </div>

            {/* Future: add Researcher, Health Worker roles here */}
        </div>
    );
}

function RoleCard({ icon, tag, title, description, accentColor, bgColor, onClick }) {
    return (
        <button
            onClick={onClick}
            style={{ width: 280, background: '#FFFFFF', borderRadius: 22, padding: '36px 28px', border: '1.5px solid #E2E8F0', textAlign: 'left', cursor: 'pointer', transition: 'box-shadow 0.2s, transform 0.2s', boxShadow: 'none' }}
            onMouseOver={e => { e.currentTarget.style.boxShadow = '0 16px 48px rgba(8,145,178,0.12)'; e.currentTarget.style.transform = 'translateY(-5px)'; }}
            onMouseOut={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
            <div style={{ width: 52, height: 52, borderRadius: 14, background: bgColor, color: accentColor, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                {icon}
            </div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: accentColor, marginBottom: 8 }}>{tag}</p>
            <h3 style={{ fontFamily: "'Lexend', sans-serif", fontSize: 19, fontWeight: 700, color: '#0C3547', marginBottom: 10 }}>{title}</h3>
            <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7, marginBottom: 20 }}>{description}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13.5, fontWeight: 700, color: accentColor }}>
                Continue <ChevronRight size={16} />
            </div>
        </button>
    );
}
