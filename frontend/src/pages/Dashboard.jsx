import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE } from '../api/config';
import { ShieldAlert, TrendingUp, Users, Activity, CheckCircle2, WifiOff, Clock } from 'lucide-react';

// Backend response shapes:
// case-summary → { totalCases, emergencyCases, urgentCases, routineCases }
// outbreaks    → { outbreaks: [ { district, disease, risk_score, recent_cases } ] }
const fetchSummary = async () => (await axios.get(`${API_BASE}/api/analytics/case-summary`)).data;
const fetchOutbreaks = async () => {
    const data = (await axios.get(`${API_BASE}/api/analytics/outbreaks`)).data;
    return Array.isArray(data?.outbreaks) ? data.outbreaks : [];
};

export default function Dashboard() {
    const summaryQ = useQuery({
        queryKey: ['summary'],
        queryFn: fetchSummary,
        refetchInterval: 5000,           // Poll every 5 seconds
        refetchIntervalInBackground: true,
    });

    const outbreaksQ = useQuery({
        queryKey: ['outbreaks'],
        queryFn: fetchOutbreaks,
        refetchInterval: 5000,
        refetchIntervalInBackground: true,
    });

    const lastUpdated = summaryQ.dataUpdatedAt
        ? new Date(summaryQ.dataUpdatedAt).toLocaleTimeString()
        : null;

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary-600">
                        Government <span style={{ color: '#0891B2' }}>Dashboard</span>
                    </h1>
                    <p className="text-slate-500 mt-1">Polls backend every 5 seconds automatically.</p>
                </div>

                {/* Real connection status */}
                <div className="flex flex-col items-end gap-1">
                    {summaryQ.isError ? (
                        <div className="flex items-center gap-2 text-sm font-bold text-red-600 bg-red-50 border border-red-200 px-4 py-2 rounded-full">
                            <WifiOff className="w-4 h-4" /> Backend Offline
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-sm font-bold bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full">
                            <div className={`w-2 h-2 rounded-full bg-emerald-500 ${summaryQ.isFetching ? 'animate-ping' : 'animate-pulse'}`} />
                            {summaryQ.isFetching ? 'Syncing...' : 'Live'}
                        </div>
                    )}
                    {lastUpdated && (
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {lastUpdated}
                        </span>
                    )}
                </div>
            </div>

            {/* Error banner */}
            {summaryQ.isError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                    ⚠️ Cannot reach <strong>{API_BASE}</strong>. Is Spring Boot running?
                </div>
            )}

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <KPICard
                    label="Total Cases (24h)"
                    value={summaryQ.data?.totalCases ?? 0}
                    icon={<Users className="w-5 h-5 text-primary-500" />}
                    loading={summaryQ.isLoading}
                />
                <KPICard
                    label="Emergency Flags"
                    value={summaryQ.data?.emergencyCases ?? 0}
                    icon={<Activity className="w-5 h-5 text-red-500" />}
                    loading={summaryQ.isLoading}
                    danger={(summaryQ.data?.emergencyCases ?? 0) > 0}
                />
                <KPICard
                    label="Routine Cases"
                    value={summaryQ.data?.routineCases ?? 0}
                    icon={<TrendingUp className="w-5 h-5" style={{ color: '#059669' }} />}
                    loading={summaryQ.isLoading}
                />
            </div>

            {/* Outbreak Radar */}
            <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                <h2 className="text-xl font-heading font-bold mb-5 flex items-center gap-2 text-slate-900">
                    <ShieldAlert className="w-5 h-5 text-red-500" /> Epidemic Radar
                </h2>

                {outbreaksQ.isLoading ? (
                    <div className="h-32 flex items-center justify-center text-slate-400 text-sm animate-pulse">
                        Scanning regions...
                    </div>
                ) : !outbreaksQ.data || outbreaksQ.data.length === 0 ? (
                    <div className="h-32 flex flex-col items-center justify-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <CheckCircle2 className="w-7 h-7 mb-2" style={{ color: '#059669' }} />
                        <p className="text-sm">No active outbreaks detected.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {outbreaksQ.data.map((ob, i) => (
                            <div key={i} className="flex items-center justify-between p-5 bg-red-50 border border-red-100 rounded-xl">
                                <div>
                                    <p className="font-bold text-red-900 text-lg">{ob.district}</p>
                                    <p className="text-sm text-red-600">{ob.disease} · {ob.recent_cases} cases</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-bold bg-red-200 text-red-900 px-2 py-1 rounded-md block mb-1">SPIKE</span>
                                    <span className="text-xs text-red-500">Risk {ob.risk_score}/10</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function KPICard({ label, value, icon, loading, danger }) {
    return (
        <div className={`p-6 rounded-2xl border transition-all ${danger ? 'bg-red-50 border-red-200' : 'bg-white border-slate-100 shadow-sm'}`}>
            <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</span>
                <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
            </div>
            <div className="text-5xl font-heading font-black text-slate-900">
                {loading ? <span className="opacity-20 animate-pulse">—</span> : value}
            </div>
        </div>
    );
}
