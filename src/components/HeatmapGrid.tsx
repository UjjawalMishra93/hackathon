import type { ZoneInfo } from '../data/mockZones';
import ZoneCard from './ZoneCard';
import { LayoutGrid } from 'lucide-react';

interface HeatmapGridProps {
    zones: ZoneInfo[];
    onZoneClick?: (zone: ZoneInfo) => void;
}

export default function HeatmapGrid({ zones, onZoneClick }: HeatmapGridProps) {
    return (
        <div className="col-span-1 lg:col-span-2 flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
                <h2 id="heatmap-grid-title" className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl" aria-hidden="true">
                        <LayoutGrid className="w-6 h-6" />
                    </div>
                    Live Overview
                </h2>
                <div className="flex gap-2 text-sm text-slate-500 font-medium items-center bg-white px-4 py-2 rounded-full shadow-sm">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                    </span>
                    System Live
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" role="region" aria-labelledby="heatmap-grid-title">
                {zones.map(zone => (
                    <ZoneCard key={zone.id} zone={zone} onClick={() => onZoneClick?.(zone)} />
                ))}
            </div>
        </div>
    );
}
