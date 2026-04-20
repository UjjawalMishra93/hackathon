import { AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import type { ZoneInfo } from '../data/mockZones';
import { motion, AnimatePresence } from 'framer-motion';

interface AlertPanelProps {
    zones: ZoneInfo[];
    onResolveAlert?: (id: string) => void;
}

export default function AlertPanel({ zones, onResolveAlert }: AlertPanelProps) {
    const bottlenecks = zones.filter(z => z.density > 85);
    const warnings = zones.filter(z => z.density > 60 && z.density <= 85);

    return (
        <div
            className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200 flex flex-col gap-6"
            aria-label="Incident Alerts panel"
        >
            <h2 className="text-xl font-bold flex items-center gap-3 text-slate-800 tracking-tight">
                <div className="p-2 bg-red-50 text-red-600 rounded-xl" aria-hidden="true">
                    <AlertTriangle className="w-5 h-5" />
                </div>
                Incident Alerts
            </h2>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2" role="status" aria-live="polite" aria-label="Live incident alerts">
                <AnimatePresence>
                    {bottlenecks.map(zone => (
                        <motion.div
                            key={`alert-${zone.id}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="p-5 rounded-2xl bg-white border border-slate-200 flex flex-col items-start gap-4 shadow-sm"
                        >
                            <div className="flex items-start gap-3 w-full">
                                <div className="mt-0.5 relative" aria-hidden="true">
                                    <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping absolute opacity-75" />
                                    <div className="w-2.5 h-2.5 bg-red-500 rounded-full relative" />
                                </div>
                                <div className="flex-1 -mt-1">
                                    <h4 className="text-slate-900 font-bold text-sm">Critical Capacity</h4>
                                    <p className="text-slate-500 text-xs mt-1 font-medium">{zone.name} usage at {zone.density}%</p>
                                </div>
                            </div>
                            {onResolveAlert && (
                                <button
                                    onClick={() => onResolveAlert(zone.id)}
                                    aria-label={`Dispatch response to ${zone.name} — currently at ${zone.density}% capacity`}
                                    className="w-full mt-1 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs py-2 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
                                >
                                    <ShieldAlert className="w-3.5 h-3.5" aria-hidden="true" />
                                    Dispatch Response
                                </button>
                            )}
                        </motion.div>
                    ))}

                    {warnings.length > 0 && bottlenecks.length === 0 && warnings.map(zone => (
                        <motion.div
                            key={`warn-${zone.id}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="p-5 rounded-2xl bg-white border border-slate-200 flex flex-col items-start gap-3 shadow-sm"
                        >
                            <div className="flex items-start gap-3 w-full">
                                <div className="mt-0.5" aria-hidden="true">
                                    <div className="w-2.5 h-2.5 bg-amber-500 rounded-full relative" />
                                </div>
                                <div className="flex-1 -mt-1">
                                    <h4 className="text-slate-900 font-bold text-sm">Elevated Traffic</h4>
                                    <p className="text-slate-500 text-xs mt-1 font-medium">{zone.name} usage at {zone.density}%</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {bottlenecks.length === 0 && warnings.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3"
                            role="status"
                        >
                            <CheckCircle2 className="w-5 h-5 text-slate-400" aria-hidden="true" />
                            <div>
                                <h4 className="text-slate-700 font-bold text-sm">All Systems Nominal</h4>
                                <p className="text-slate-500 text-xs mt-1 font-medium">No critical incidents detected.</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
