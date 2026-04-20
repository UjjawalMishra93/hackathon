import { motion } from 'framer-motion';
import type { ZoneInfo } from '../data/mockZones';
import { Users } from 'lucide-react';

const getCardStyle = (density: number) => {
    if (density > 85) return {
        border: 'border-red-500/20 hover:border-red-500/40',
        iconBg: 'bg-red-50 text-red-600',
        badge: 'bg-red-100 text-red-700',
        progress: 'bg-red-500',
        status: 'Critical',
    };
    if (density > 60) return {
        border: 'border-amber-500/20 hover:border-amber-500/40',
        iconBg: 'bg-amber-50 text-amber-600',
        badge: 'bg-amber-100 text-amber-700',
        progress: 'bg-amber-500',
        status: 'Busy',
    };
    return {
        border: 'border-slate-200 hover:border-slate-300',
        iconBg: 'bg-slate-50 text-slate-500',
        badge: 'bg-slate-100 text-slate-600',
        progress: 'bg-indigo-500',
        status: 'Normal',
    };
};

interface ZoneCardProps {
    zone: ZoneInfo;
    onClick?: () => void;
}

export default function ZoneCard({ zone, onClick }: ZoneCardProps) {
    const style = getCardStyle(zone.density);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick?.();
        }
    };

    return (
        <motion.div
            onClick={onClick}
            onKeyDown={handleKeyDown}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            // Accessibility: treat as a button so keyboard & screen-reader users can activate it
            role="button"
            tabIndex={0}
            aria-label={`${zone.name} — ${style.status}, ${zone.density}% occupancy. Click to view details.`}
            className={`bg-white rounded-3xl p-6 border shadow-sm transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${style.border}`}
        >
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-xl ${style.iconBg}`} aria-hidden="true">
                        <Users className="w-5 h-5" />
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${style.badge}`}>
                        {style.status}
                    </span>
                </div>
                <div aria-hidden="true">
                    <div className={`w-2 h-2 rounded-full mt-2 mr-1 ${style.progress}`} />
                </div>
            </div>

            <h3 className="text-lg font-bold mb-1 text-slate-800">{zone.name}</h3>

            <div className="flex items-end gap-2 text-slate-800">
                <motion.span
                    key={zone.density}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-extrabold tracking-tight"
                    aria-live="polite"
                    aria-atomic="true"
                >
                    {zone.density}%
                </motion.span>
                <span className="text-xs mb-1.5 font-semibold text-slate-400 uppercase tracking-wider">Occupancy</span>
            </div>

            {/* Progress bar */}
            <div
                className="w-full h-1.5 rounded-full mt-5 bg-slate-100 overflow-hidden"
                role="progressbar"
                aria-valuenow={zone.density}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${zone.name} occupancy: ${zone.density}%`}
            >
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${zone.density}%` }}
                    className={`h-full rounded-full ${style.progress}`}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                />
            </div>
        </motion.div>
    );
}
