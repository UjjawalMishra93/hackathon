import { Compass, Navigation } from 'lucide-react';
import type { ZoneInfo } from '../data/mockZones';

interface RouteSuggestionProps {
    zones: ZoneInfo[];
}

export default function RouteSuggestion({ zones }: RouteSuggestionProps) {
    const nExit = zones.find(z => z.name === 'North Exit')?.density || 50;
    const gateA = zones.find(z => z.name === 'Gate A')?.density || 50;
    const gateB = zones.find(z => z.name === 'Gate B')?.density || 50;

    let route = { corridor: 'East Corridor', gate: 'Gate C' as string, saved: 4 };

    if (nExit < 60) {
        route = { corridor: 'Center Aisle', gate: 'North Exit', saved: 6 };
    } else if (gateB < 60) {
        route = { corridor: 'East Corridor', gate: 'Gate B', saved: 4 };
    } else if (gateA < 60) {
        route = { corridor: 'West Corridor', gate: 'Gate A', saved: 3 };
    } else {
        route = { corridor: 'Upper Catwalk', gate: 'South Exit', saved: 1 };
    }

    return (
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200" aria-labelledby="route-suggestion-title" role="region">
            <h2 id="route-suggestion-title" className="text-xl font-bold mb-6 flex items-center gap-3 text-slate-800 tracking-tight">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl" aria-hidden="true">
                    <Compass className="w-5 h-5" />
                </div>
                Suggested Route
            </h2>

            <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 text-sm text-slate-600" aria-label={`Suggested route from Seat B 12, via ${route.corridor}, to ${route.gate}`}>
                        <span className="bg-white px-3 py-1.5 rounded-lg text-slate-800 font-bold border border-slate-200 shadow-sm">Seat B12</span>
                        <Navigation className="w-4 h-4 text-slate-400 rotate-90" aria-hidden="true" />
                        <span className="font-semibold">{route.corridor}</span>
                        <Navigation className="w-4 h-4 text-slate-400 rotate-90" aria-hidden="true" />
                        <span className="bg-indigo-50 px-3 py-1.5 rounded-lg text-indigo-700 font-bold border border-indigo-100 shadow-sm">{route.gate}</span>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-4 border-t border-slate-200 transition-all duration-300">
                        <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">Time Advantage</span>
                        <span className={`text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-1.5 ${route.saved > 3 ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                            ⏱ Saves ~{route.saved} mins
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
