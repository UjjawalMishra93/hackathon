import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation2, Clock, Coffee, Droplets, Utensils, ChevronRight } from 'lucide-react';
import type { ZoneInfo } from '../data/mockZones';

interface FanMobileViewProps {
    isOpen: boolean;
    onClose: () => void;
    zones: ZoneInfo[];
}

export default function FanMobileView({ isOpen, onClose, zones }: FanMobileViewProps) {
    if (!isOpen) return null;

    // Derived logic same as RouteSuggestion
    const nExit = zones.find(z => z.name === 'North Exit')?.density || 50;
    const gateA = zones.find(z => z.name === 'Gate A')?.density || 50;
    const gateB = zones.find(z => z.name === 'Gate B')?.density || 50;

    let route = { corridor: 'East Corridor', gate: 'Gate C' as string, saved: 4, safe: true };
    if (nExit < 60) { route = { corridor: 'Center Aisle', gate: 'North Exit', saved: 6, safe: true }; }
    else if (gateB < 60) { route = { corridor: 'East Corridor', gate: 'Gate B', saved: 4, safe: true }; }
    else if (gateA < 60) { route = { corridor: 'West Corridor', gate: 'Gate A', saved: 3, safe: true }; }
    else { route = { corridor: 'Upper Catwalk', gate: 'South Exit', saved: 1, safe: false }; }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                role="dialog"
                aria-modal="true"
                aria-label="Fan Mobile View App Preview"
                className="fixed bottom-6 right-6 z-50 pointer-events-auto"
            >
                <div className="relative w-[320px] h-[650px] bg-black rounded-[40px] border-[8px] border-zinc-800 shadow-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-1 ring-white/10">

                    {/* Notch/Dynamic Island mockup */}
                    <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-20">
                        <div className="w-24 h-5 bg-zinc-800 rounded-b-xl" />
                    </div>

                    {/* App Header */}
                    <div className="absolute top-8 left-4 right-4 flex justify-between items-center z-10">
                        <div className="text-zinc-400 font-semibold text-xs">VenueFlow App</div>
                        <button onClick={onClose} aria-label="Close Fan App Preview" className="p-1.5 bg-zinc-800/80 rounded-full text-zinc-400 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
                            <ChevronRight className="w-4 h-4 translate-x-0.5" aria-hidden="true" />
                        </button>
                    </div>

                    {/* App Content */}
                    <div className="h-full pt-16 pb-6 px-5 bg-gradient-to-b from-zinc-900 to-black overflow-y-auto custom-scrollbar flex flex-col gap-5">

                        {/* Hero Greeting */}
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-1">Hi, Alex! 👋</h2>
                            <p className="text-sm text-zinc-400">Match active • Seat B12</p>
                        </div>

                        {/* Live Routing Card */}
                        <div className="bg-indigo-600/20 border border-indigo-500/30 rounded-2xl p-4">
                            <div className="flex items-center gap-2 text-indigo-300 font-semibold text-sm mb-3">
                                <Navigation2 className="w-4 h-4" />
                                Smart Routing Active
                            </div>

                            <div className="flex flex-col gap-3 relative">
                                <div className="absolute left-3.5 top-5 bottom-5 w-0.5 bg-indigo-500/30" />

                                <div className="flex items-center gap-3 relative z-10">
                                    <div className="w-7 h-7 bg-indigo-500/20 flex items-center justify-center rounded-full border border-indigo-500/50 text-indigo-300">
                                        <div className="w-2 h-2 bg-indigo-400 rounded-full" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-zinc-400">Start</div>
                                        <div className="text-sm font-semibold text-zinc-100">Seat B12</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 relative z-10">
                                    <div className="w-7 h-7 bg-zinc-800 flex items-center justify-center rounded-full border border-zinc-700 text-zinc-400">
                                        <MapPin className="w-3.5 h-3.5" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-zinc-400">Via</div>
                                        <div className="text-sm font-semibold text-zinc-100">{route.corridor}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 relative z-10">
                                    <div className="w-7 h-7 bg-green-500/20 flex items-center justify-center rounded-full border border-green-500/50 text-green-300">
                                        <Navigation2 className="w-3.5 h-3.5" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-zinc-400">Exit</div>
                                        <div className="text-sm font-semibold text-zinc-100">{route.gate}</div>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full mt-4 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm shadow-[0_0_15px_rgba(99,102,241,0.4)] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900">
                                Start Navigation ({route.saved} min saved)
                            </button>
                        </div>

                        {/* Live Amenities */}
                        <div>
                            <h3 className="text-sm font-semibold text-zinc-300 mb-3 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-zinc-400" />
                                Live Wait Times
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { name: 'Burger St.', time: '4m', icon: <Utensils className="w-4 h-4" />, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
                                    { name: 'Coffee', time: '1m', icon: <Coffee className="w-4 h-4" />, color: 'text-green-400', bg: 'bg-green-400/10' },
                                    { name: 'Merch', time: '12m', icon: <MapPin className="w-4 h-4" />, color: 'text-red-400', bg: 'bg-red-400/10' },
                                    { name: 'Washroom', time: '3m', icon: <Droplets className="w-4 h-4" />, color: 'text-green-400', bg: 'bg-green-400/10' },
                                ].map((item, i) => (
                                    <div key={i} className="bg-zinc-800/50 rounded-xl p-3 border border-zinc-700/50">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${item.bg} ${item.color}`}>
                                            {item.icon}
                                        </div>
                                        <div className="text-xs font-semibold text-zinc-300 truncate">{item.name}</div>
                                        <div className={`text-sm font-bold ${item.color}`}>{item.time} wait</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
