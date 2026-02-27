import { useNavigate } from 'react-router-dom';
import { ShieldPlus, BarChart2, Cpu, Users, MapPin, Zap, ArrowRight, ChevronRight, Activity } from 'lucide-react';

/* ─── Design Tokens ────────────────────────────────────────────────── */
const C = {
    teal900: '#0C3547',
    teal700: '#164E63',
    teal500: '#0891B2',
    teal300: '#67E8F9',
    teal100: '#CFFAFE',
    teal50: '#F0FDFF',
    white: '#FFFFFF',
    slate900: '#0F172A',
    slate600: '#475569',
    slate400: '#94A3B8',
    slate100: '#F1F5F9',
    green500: '#059669',
};

/* ─── Stats ─────────────────────────────────────────────────────────── */
const STATS = [
    { value: '< 10s', label: 'Average Triage Time' },
    { value: '10+', label: 'Specialist Languages' },
    { value: '100%', label: 'AI Confidence Threshold' },
    { value: '24/7', label: 'Outbreak Monitoring' },
];

/* ─── Features ──────────────────────────────────────────────────────── */
const FEATURES = [
    {
        icon: <Cpu className="w-6 h-6" />,
        tag: 'Core Engine',
        title: 'Autonomous AI Triage',
        desc: 'Symptoms are analysed in real-time, scored by severity, and instantly routed — no manual sorting, no delays.',
        color: C.teal500,
        bg: '#EFF9FC',
    },
    {
        icon: <Users className="w-6 h-6" />,
        tag: 'Smart Routing',
        title: 'Language-Matched Specialists',
        desc: 'Patients are matched to available doctors by language and district — removing communication barriers in rural care.',
        color: C.green500,
        bg: '#ECFDF5',
    },
    {
        icon: <Activity className="w-6 h-6" />,
        tag: 'Epidemic Intelligence',
        title: 'Outbreak Radar',
        desc: 'Spike detection across districts flags potential outbreaks before they escalate. Real-time alerts for health officials.',
        color: '#DC2626',
        bg: '#FEF2F2',
    },
    {
        icon: <BarChart2 className="w-6 h-6" />,
        tag: 'Government Tier',
        title: 'Live Analytics Dashboard',
        desc: 'District-level case summaries, emergency counts, and outbreak heatmaps — updated every 5 seconds.',
        color: C.teal700,
        bg: '#EFF9FC',
    },
];

/* ─── Steps ─────────────────────────────────────────────────────────── */
const STEPS = [
    { n: '01', title: 'Patient Walks In', desc: 'A health worker opens HealthReach and logs the patient\'s basic details — name, age, language, district.' },
    { n: '02', title: 'AI Reads Symptoms', desc: 'Fever, breathlessness, cough duration — the engine scores severity in under a second and classifies the case.' },
    { n: '03', title: 'Routed Instantly', desc: 'Emergency cases dispatch an ambulance. Stable cases get a language-matched specialist and diagnosis.' },
];

/* ─── Component ─────────────────────────────────────────────────────── */
export default function Landing() {
    const nav = useNavigate();

    return (
        <div style={{ background: C.white, color: C.slate900, fontFamily: "'Source Sans 3', system-ui, sans-serif" }}>

            {/* ── Top Nav ─────────────────────────────────────────────── */}
            <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, padding: '16px 0' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${C.teal500}, ${C.teal700})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ShieldPlus size={18} color="white" />
                        </div>
                        <span style={{ fontFamily: "'Lexend', sans-serif", fontWeight: 700, fontSize: 18, color: C.teal700 }}>HealthReach</span>
                    </div>

                    {/* Future: add nav links here */}
                    <button
                        onClick={() => nav('/analytics')}
                        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 20px', borderRadius: 100, border: `1.5px solid ${C.teal100}`, background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)', cursor: 'pointer', fontSize: 13.5, fontWeight: 600, color: C.teal700 }}
                    >
                        <BarChart2 size={15} />
                        View Metrics
                    </button>
                </div>
            </header>

            {/* ── Hero ────────────────────────────────────────────────── */}
            <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px 32px 80px', background: `linear-gradient(170deg, ${C.teal50} 0%, ${C.white} 60%)`, position: 'relative', overflow: 'hidden', textAlign: 'center' }}>

                {/* Background blobs */}
                <div style={{ position: 'absolute', top: -80, right: -80, width: 500, height: 500, borderRadius: '50%', background: `radial-gradient(circle, ${C.teal100} 0%, transparent 65%)`, pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: -60, left: -80, width: 400, height: 400, borderRadius: '50%', background: `radial-gradient(circle, #BAE6FD 0%, transparent 65%)`, pointerEvents: 'none' }} />

                <div style={{ position: 'relative', maxWidth: 760, margin: '0 auto' }}>
                    {/* Eyebrow tag */}
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: C.teal100, borderRadius: 100, padding: '6px 16px', marginBottom: 28 }}>
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.teal500, display: 'inline-block', animation: 'pulse 2s infinite' }} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: C.teal700 }}>AI-Powered · Rural Healthcare · India</span>
                    </div>

                    {/* Headline */}
                    <h1 style={{ fontFamily: "'Lexend', sans-serif", fontSize: 'clamp(2.4rem, 5vw, 4rem)', fontWeight: 900, lineHeight: 1.12, letterSpacing: '-0.02em', color: C.teal900, marginBottom: 24 }}>
                        Your Trusted Partner<br />
                        in <span style={{ color: C.teal500 }}>Rural Healthcare</span>
                    </h1>

                    {/* Sub */}
                    <p style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: C.slate600, lineHeight: 1.75, maxWidth: 580, margin: '0 auto 48px' }}>
                        AI triage that connects patients to the right specialist in seconds — breaking language barriers, detecting outbreaks early, and giving governments real-time visibility.
                    </p>

                    {/* CTAs */}
                    <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => nav('/role')}
                            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 36px', borderRadius: 14, background: `linear-gradient(135deg, ${C.teal500}, ${C.teal700})`, color: C.white, fontWeight: 700, fontSize: 16, border: 'none', cursor: 'pointer', boxShadow: `0 8px 30px ${C.teal500}40`, transition: 'transform 0.2s, box-shadow 0.2s' }}
                            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 12px 36px ${C.teal500}55`; }}
                            onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 8px 30px ${C.teal500}40`; }}
                        >
                            Enter Platform <ArrowRight size={18} />
                        </button>
                        <button
                            onClick={() => nav('/analytics')}
                            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '16px 28px', borderRadius: 14, background: C.white, color: C.teal700, fontWeight: 600, fontSize: 15, border: `2px solid ${C.teal100}`, cursor: 'pointer' }}
                        >
                            <BarChart2 size={16} /> View Analytics
                        </button>
                    </div>

                    {/* Trust bar */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 48 }}>
                        <div style={{ display: 'flex', gap: 0 }}>
                            {['#0891B2', '#059669', '#F59E0B', '#8B5CF6'].map((c, i) => (
                                <div key={i} style={{ width: 28, height: 28, borderRadius: '50%', background: c, border: '2px solid white', marginLeft: i > 0 ? -8 : 0 }} />
                            ))}
                        </div>
                        <span style={{ fontSize: 13.5, color: C.slate600, marginLeft: 4 }}>
                            Built for <strong style={{ color: C.teal700 }}>health workers</strong> and <strong style={{ color: C.teal700 }}>government officials</strong>
                        </span>
                    </div>
                </div>
            </section>

            {/* ── Stats Band ───────────────────────────────────────────── */}
            <section style={{ background: `linear-gradient(135deg, ${C.teal700}, ${C.teal900})`, padding: '56px 32px' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, textAlign: 'center' }}>
                    {STATS.map((s, i) => (
                        <div key={i}>
                            <div style={{ fontFamily: "'Lexend', sans-serif", fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900, color: C.white, lineHeight: 1 }}>{s.value}</div>
                            <div style={{ fontSize: 14, color: C.teal300, marginTop: 8, fontWeight: 500 }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── What We Do ───────────────────────────────────────────── */}
            <section style={{ padding: '100px 32px', background: C.white }}>
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>

                    {/* Section header */}
                    <div style={{ textAlign: 'center', marginBottom: 64 }}>
                        <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.teal500 }}>+ WHAT WE DO</span>
                        <h2 style={{ fontFamily: "'Lexend', sans-serif", fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 800, color: C.teal900, marginTop: 12, lineHeight: 1.2 }}>
                            A Simplified Path to<br />Comprehensive Healthcare
                        </h2>
                        <p style={{ fontSize: 16, color: C.slate600, marginTop: 16, maxWidth: 540, margin: '16px auto 0' }}>
                            We bridge the gap between patients in remote districts and quality care — using AI, language intelligence, and live data.
                        </p>
                    </div>

                    {/* Feature grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
                        {FEATURES.map((f, i) => (
                            <div key={i} style={{ background: C.white, border: `1.5px solid ${C.slate100}`, borderRadius: 20, padding: '32px 28px', transition: 'box-shadow 0.2s, transform 0.2s', cursor: 'default' }}
                                onMouseOver={e => { e.currentTarget.style.boxShadow = '0 12px 40px rgba(8,145,178,0.10)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                                onMouseOut={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                                <div style={{ width: 48, height: 48, borderRadius: 14, background: f.bg, color: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                                    {f.icon}
                                </div>
                                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: f.color }}>{f.tag}</span>
                                <h3 style={{ fontFamily: "'Lexend', sans-serif", fontSize: 18, fontWeight: 700, color: C.slate900, marginTop: 8, marginBottom: 10 }}>{f.title}</h3>
                                <p style={{ fontSize: 14.5, color: C.slate600, lineHeight: 1.7 }}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── How It Works ─────────────────────────────────────────── */}
            <section style={{ padding: '100px 32px', background: C.teal50 }}>
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>

                    <div style={{ textAlign: 'center', marginBottom: 72 }}>
                        <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.teal500 }}>+ APPROACH</span>
                        <h2 style={{ fontFamily: "'Lexend', sans-serif", fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 800, color: C.teal900, marginTop: 12 }}>
                            From Symptom to Specialist<br />in Three Steps
                        </h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32, position: 'relative' }}>
                        {STEPS.map((s, i) => (
                            <div key={i} style={{ position: 'relative' }}>
                                <div style={{ background: C.white, borderRadius: 20, padding: '36px 32px', border: `1.5px solid ${C.teal100}`, height: '100%' }}>
                                    <div style={{ fontFamily: "'Lexend', sans-serif", fontSize: 48, fontWeight: 900, color: C.teal100, lineHeight: 1, marginBottom: 20 }}>{s.n}</div>
                                    <h3 style={{ fontFamily: "'Lexend', sans-serif", fontSize: 19, fontWeight: 700, color: C.teal900, marginBottom: 12 }}>{s.title}</h3>
                                    <p style={{ fontSize: 14.5, color: C.slate600, lineHeight: 1.75 }}>{s.desc}</p>
                                </div>
                                {i < STEPS.length - 1 && (
                                    <div style={{ position: 'absolute', top: '50%', right: -16, transform: 'translateY(-50%)', zIndex: 2, display: 'none' }}>
                                        <ChevronRight size={24} color={C.teal300} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Future Phases Placeholder ─────────────────────────────── */}
            {/* 
        PHASE 2 SECTION: Telemedicine / Video Consult
        PHASE 3 SECTION: Predictive Analytics / ML Risk Maps
        PHASE 4 SECTION: AYUSH Integration / Community Health Workers
        → Each will slot in here as a new <section> block
      */}

            {/* ── Final CTA ─────────────────────────────────────────────── */}
            <section style={{ padding: '100px 32px', background: `linear-gradient(135deg, ${C.teal900} 0%, #0C4A6E 100%)`, textAlign: 'center' }}>
                <div style={{ maxWidth: 700, margin: '0 auto' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 100, padding: '8px 20px', marginBottom: 32 }}>
                        <Zap size={14} color={C.teal300} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: C.teal300 }}>Ready to transform rural healthcare?</span>
                    </div>
                    <h2 style={{ fontFamily: "'Lexend', sans-serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: C.white, lineHeight: 1.2, marginBottom: 20 }}>
                        Start Triaging.<br />Save Lives.
                    </h2>
                    <p style={{ fontSize: 16, color: C.teal300, marginBottom: 48, lineHeight: 1.7 }}>
                        Join health workers and government officials using HealthReach<br />to deliver faster, smarter, and more equitable care.
                    </p>
                    <button
                        onClick={() => { window.location.href = '/role'; }}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '18px 44px', borderRadius: 14, background: C.white, color: C.teal700, fontWeight: 800, fontSize: 17, border: 'none', cursor: 'pointer', boxShadow: '0 8px 30px rgba(0,0,0,0.3)', transition: 'transform 0.2s' }}
                        onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-3px)'; }}
                        onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                        Enter HealthReach <ArrowRight size={20} />
                    </button>
                </div>
            </section>

            {/* ── Footer ──────────────────────────────────────────────── */}
            <footer style={{ background: C.teal900, borderTop: `1px solid rgba(255,255,255,0.06)`, padding: '32px', textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg, ${C.teal500}, ${C.teal700})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ShieldPlus size={14} color="white" />
                    </div>
                    <span style={{ fontFamily: "'Lexend', sans-serif", fontWeight: 700, color: C.white, fontSize: 15 }}>HealthReach</span>
                </div>
                <p style={{ fontSize: 12.5, color: C.slate400 }}>
                    Built for India's underserved communities · AI Triage · Epidemic Intelligence · Live Analytics
                </p>
                <p style={{ fontSize: 11.5, color: C.slate600, marginTop: 8 }}>© 2026 HealthReach. All rights reserved.</p>
            </footer>

            <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>
        </div>
    );
}
