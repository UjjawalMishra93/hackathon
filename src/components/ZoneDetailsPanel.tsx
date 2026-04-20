import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Activity, Camera, ShieldAlert } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { ZoneInfo } from '../data/mockZones';
import AICameraFeed from './AICameraFeed';

interface ZoneDetailsPanelProps {
    zone: ZoneInfo | null;
    onClose: () => void;
}

const generateMockHistory = (currentDensity: number) => {
    const data = [];
    let current = currentDensity;
    for (let i = 10; i >= 0; i--) {
        data.push({
            time: `-${i}m`,
            density: Math.max(10, Math.min(100, current)),
        });
        current = current + (Math.random() * 20 - 10);
    }
    return data;
};

export default function ZoneDetailsPanel({ zone, onClose }: ZoneDetailsPanelProps) {
    if (!zone) return null;

    const data = generateMockHistory(zone.density);
    const color = zone.density > 85 ? '#ef4444' : zone.density > 60 ? '#f97316' : '#8b5cf6';
    const personnel = Math.max(2, Math.floor(zone.density / 20));

    return (
        <AnimatePresence>
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                role="dialog"
                aria-modal="true"
                aria-labelledby="zone-panel-title"
                className="fixed right-0 top-0 bottom-0 w-full sm:w-[450px] bg-white border-l border-slate-200 shadow-2xl z-50 flex flex-col"
            >
                {/* Header */}
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/80 backdrop-blur-md">
                    <div>
                        <h2 id="zone-panel-title" className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl" aria-hidden="true">
                                <Camera className="w-5 h-5" />
                            </div>
                            {zone.name}
                        </h2>
                        <span className="text-sm font-semibold text-slate-500 mt-2 block tracking-tight">Live Intelligence Feed</span>
                    </div>
                    <button
                        onClick={onClose}
                        aria-label={`Close ${zone.name} details panel`}
                        className="p-2.5 bg-white shadow-sm border border-slate-200 hover:bg-slate-50 rounded-full transition-colors text-slate-500 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    >
                        <X className="w-5 h-5" aria-hidden="true" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">

                    {/* Live Camera Feed */}
                    <div className="space-y-4">
                        <AICameraFeed density={zone.density} />

                        {/* Status Overview */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 shadow-sm">
                                <div className="text-slate-400 text-xs font-bold mb-2 uppercase tracking-wider" aria-hidden="true">Current Load</div>
                                <div
                                    className="text-4xl font-extrabold"
                                    style={{ color }}
                                    aria-label={`Current load: ${zone.density}%`}
                                >
                                    {zone.density}%
                                </div>
                            </div>
                            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 shadow-sm">
                                <div className="text-slate-400 text-xs font-bold mb-2 uppercase tracking-wider" aria-hidden="true">Est. People</div>
                                <div
                                    className="text-4xl font-extrabold text-slate-700"
                                    aria-label={`Estimated people: approximately ${Math.floor(zone.density * 5.4)}`}
                                >
                                    ~{Math.floor(zone.density * 5.4)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="h-56 w-full bg-white border border-slate-100 p-5 rounded-2xl shadow-sm">
                        <h3 className="text-sm font-bold text-slate-700 mb-6 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-indigo-500" />
                            Traffic Trend (Last 10 Min)
                        </h3>
                        <ResponsiveContainer width="100%" height="80%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorDensity" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                                        <stop offset="95%" stopColor={color} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="density" stroke={color} strokeWidth={3} fillOpacity={1} fill="url(#colorDensity)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Action Panel */}
                    <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-indigo-900 font-bold mb-4 flex items-center gap-2">
                            <ShieldAlert className="w-5 h-5 text-indigo-600" />
                            Security Protocol
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-600 font-medium">Deployed Staff</span>
                                <span className="font-bold text-slate-900 flex items-center gap-2">
                                    <div className="p-1.5 bg-indigo-200 rounded-md text-indigo-700">
                                        <Users className="w-4 h-4" />
                                    </div>
                                    {personnel} Active
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm border-t border-indigo-100/50 pt-4">
                                <span className="text-slate-600 font-medium">Nearest Exit</span>
                                <span className="font-bold text-slate-900">North Gate</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                aria-hidden="true"
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
            />
        </AnimatePresence>
    );
}
