import { useNavigate } from 'react-router-dom';
import { ShieldPlus, BarChart2 } from 'lucide-react';

export default function Landing() {
    const nav = useNavigate();

    return (
        <div className="min-h-screen flex flex-col" style={{ background: '#F0FDFF' }}>
            {/* Top right — View Metrics */}
            <div className="flex justify-end p-6">
                <button
                    onClick={() => nav('/dashboard')}
                    className="flex items-center gap-2 text-sm font-semibold text-primary-600 bg-white border border-slate-200 px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                    <BarChart2 className="w-4 h-4" /> View Metrics
                </button>
            </div>

            {/* Center hero */}
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4 gap-8">
                {/* Logo */}
                <div className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg"
                        style={{ background: 'linear-gradient(135deg, #0891B2, #164E63)' }}>
                        <ShieldPlus className="w-10 h-10 text-white" />
                    </div>
                    <div>
                        <h1 className="text-5xl md:text-6xl font-heading font-black text-primary-600 tracking-tight">
                            HealthReach
                        </h1>
                        <p className="text-slate-500 text-lg mt-2">
                            AI-powered triage for underserved communities
                        </p>
                    </div>
                </div>

                {/* Enter button */}
                <button
                    onClick={() => nav('/role')}
                    style={{ background: 'linear-gradient(135deg, #0891B2, #164E63)', minWidth: '200px' }}
                    className="text-white text-xl font-bold py-5 px-12 rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                >
                    Enter →
                </button>

                <p className="text-slate-400 text-sm">
                    Serving rural health workers since 2025
                </p>
            </div>
        </div>
    );
}
