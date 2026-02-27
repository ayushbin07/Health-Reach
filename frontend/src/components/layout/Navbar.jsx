import { Link, useLocation } from 'react-router-dom';
import { ShieldPlus, BarChart2 } from 'lucide-react';

export default function Navbar() {
    const loc = useLocation();
    const active = (path) => loc.pathname === path
        ? { color: '#0891B2', fontWeight: 700 }
        : { color: '#475569' };

    return (
        <nav style={{ position: 'fixed', top: 16, left: 16, right: 16, zIndex: 50 }}>
            <div style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)', borderRadius: 18, padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 12px rgba(0,0,0,0.06)', border: '1px solid #E2E8F0' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
                    <div style={{ padding: 6, background: '#EFF9FC', borderRadius: 8 }}>
                        <ShieldPlus size={18} color="#0891B2" />
                    </div>
                    <span style={{ fontFamily: "'Lexend', sans-serif", fontWeight: 700, fontSize: 16, color: '#0891B2' }}>HealthReach</span>
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                    <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, textDecoration: 'none', transition: 'color 0.15s', ...active('/dashboard') }}>
                        <BarChart2 size={15} /> Dashboard
                    </Link>
                </div>
            </div>
        </nav>
    );
}
