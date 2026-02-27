import { useNavigate } from 'react-router-dom';
import { User, Stethoscope, ArrowLeft } from 'lucide-react';

export default function RoleSelect() {
    const nav = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: '#F0FDFF' }}>
            <button onClick={() => nav('/')}
                className="absolute top-6 left-6 flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary-600 transition-colors cursor-pointer">
                <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <div className="text-center mb-12">
                <h2 className="text-3xl font-heading font-bold text-primary-600">Who are you?</h2>
                <p className="text-slate-500 mt-2">Choose your role to continue</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
                <RoleCard
                    icon={<User className="w-10 h-10" />}
                    title="I am a Patient"
                    description="Report symptoms and get instantly triaged"
                    color="#0891B2"
                    onClick={() => nav('/intake')}
                />
                <RoleCard
                    icon={<Stethoscope className="w-10 h-10" />}
                    title="I am a Doctor"
                    description="View patient dashboard and analytics"
                    color="#164E63"
                    onClick={() => nav('/dashboard')}
                />
            </div>
        </div>
    );
}

function RoleCard({ icon, title, description, color, onClick }) {
    return (
        <button
            onClick={onClick}
            className="w-72 bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:scale-105 active:scale-95 transition-all text-center group cursor-pointer"
        >
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-all group-hover:scale-110"
                style={{ background: `${color}15`, color }}>
                {icon}
            </div>
            <h3 className="font-heading font-bold text-xl text-slate-900 mb-2">{title}</h3>
            <p className="text-sm text-slate-500">{description}</p>
        </button>
    );
}
