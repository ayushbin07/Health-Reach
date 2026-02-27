import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE } from '../api/config';
import { Users, RefreshCw, WifiOff, Clock } from 'lucide-react';

const fetchPatients = async () => (await axios.get(`${API_BASE}/api/patients`)).data;

const COLUMNS = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'age', label: 'Age' },
    { key: 'gender', label: 'Gender' },
    { key: 'language', label: 'Language' },
    { key: 'district', label: 'District' },
    { key: 'createdAt', label: 'Created At' },
];

function formatDate(val) {
    if (!val) return '—';
    try { return new Date(val).toLocaleString(); } catch { return val; }
}

export default function Patients() {
    const { data, isLoading, isError, isFetching, dataUpdatedAt, refetch } = useQuery({
        queryKey: ['patients'],
        queryFn: fetchPatients,
        refetchInterval: 10000,          // refresh every 10s
        refetchIntervalInBackground: true,
    });

    const lastUpdated = dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : null;
    const patients = Array.isArray(data) ? data : [];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary-600">
                        Patient <span style={{ color: '#0891B2' }}>Registry</span>
                    </h1>
                    <p className="text-slate-500 mt-1">
                        {patients.length} patient{patients.length !== 1 ? 's' : ''} in the database
                    </p>
                </div>

                <div className="flex flex-col items-end gap-1">
                    {isError ? (
                        <div className="flex items-center gap-2 text-sm font-bold text-red-600 bg-red-50 border border-red-200 px-4 py-2 rounded-full">
                            <WifiOff className="w-4 h-4" /> Backend Offline
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => refetch()}
                                className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary-600 transition-colors cursor-pointer"
                            >
                                <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
                                Refresh
                            </button>
                            <div className="flex items-center gap-2 text-sm font-bold bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full">
                                <div className={`w-2 h-2 rounded-full bg-emerald-500 ${isFetching ? 'animate-ping' : 'animate-pulse'}`} />
                                {isFetching ? 'Syncing...' : 'Live'}
                            </div>
                        </div>
                    )}
                    {lastUpdated && (
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {lastUpdated}
                        </span>
                    )}
                </div>
            </div>

            {/* Error */}
            {isError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                    ⚠️ Cannot reach <strong>{API_BASE}/api/patients</strong>. Is Spring Boot running?
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                                {COLUMNS.map(col => (
                                    <th key={col.key}
                                        className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                // Skeleton rows
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                        {COLUMNS.map(col => (
                                            <td key={col.key} className="px-6 py-4">
                                                <div className="h-4 bg-slate-100 rounded animate-pulse" style={{ width: col.key === 'createdAt' ? '160px' : '80px' }} />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : patients.length === 0 ? (
                                <tr>
                                    <td colSpan={COLUMNS.length} className="px-6 py-16 text-center text-slate-400">
                                        <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                                        <p>No patients in the database yet.</p>
                                    </td>
                                </tr>
                            ) : (
                                patients.map((p, idx) => (
                                    <tr key={p.id}
                                        style={{
                                            borderBottom: idx < patients.length - 1 ? '1px solid #F1F5F9' : 'none',
                                            background: idx % 2 === 0 ? 'white' : '#FAFEFF',
                                        }}
                                        className="hover:bg-cyan-50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs text-slate-400">{p.id}</td>
                                        <td className="px-6 py-4 font-semibold text-slate-900">{p.name || '—'}</td>
                                        <td className="px-6 py-4 text-slate-600">{p.age ?? '—'}</td>
                                        <td className="px-6 py-4">
                                            <span style={{
                                                background: p.gender === 'Female' ? '#FDF2F8' : '#EFF6FF',
                                                color: p.gender === 'Female' ? '#9D174D' : '#1D4ED8'
                                            }}
                                                className="px-2 py-0.5 rounded-full text-xs font-semibold">
                                                {p.gender || '—'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">{p.language || '—'}</td>
                                        <td className="px-6 py-4 text-slate-600">{p.district || '—'}</td>
                                        <td className="px-6 py-4 text-slate-400 text-xs font-mono">{formatDate(p.createdAt)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
