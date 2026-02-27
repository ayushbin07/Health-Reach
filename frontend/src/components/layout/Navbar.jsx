import { Link, useLocation } from 'react-router-dom';
import { ShieldPlus, Activity, BarChart2, Users } from 'lucide-react';

export default function Navbar() {
    const loc = useLocation();
    const active = (path) => loc.pathname === path
        ? 'text-primary-600 font-bold'
        : 'text-slate-500 hover:text-primary-600';

    return (
        <nav className="fixed top-4 left-4 right-4 z-50">
            <div style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)' }}
                className="rounded-2xl px-6 py-4 flex items-center justify-between shadow-sm border border-slate-100">

                <Link to="/" className="flex items-center gap-2">
                    <div className="p-1.5 bg-cyan-50 rounded-lg">
                        <ShieldPlus className="w-5 h-5 text-primary-600" />
                    </div>
                    <span className="font-heading font-bold text-lg text-primary-600">HealthReach</span>
                </Link>

                <div className="flex items-center gap-6">
                    <Link to="/" className={`flex items-center gap-1.5 text-sm transition-colors ${active('/')}`}>
                        <Activity className="w-4 h-4" /> Triage AI
                    </Link>
                    <Link to="/dashboard" className={`flex items-center gap-1.5 text-sm transition-colors ${active('/dashboard')}`}>
                        <BarChart2 className="w-4 h-4" /> Dashboard
                    </Link>
                    <Link to="/patients" className={`flex items-center gap-1.5 text-sm transition-colors ${active('/patients')}`}>
                        <Users className="w-4 h-4" /> Patients
                    </Link>
                </div>
            </div>
        </nav>
    );
}
