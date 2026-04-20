import { useState, useEffect, useMemo, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import HeatmapGrid from '../components/HeatmapGrid';
import AlertPanel from '../components/AlertPanel';
import QueuePanel from '../components/QueuePanel';
import RouteSuggestion from '../components/RouteSuggestion';
import ZoneDetailsPanel from '../components/ZoneDetailsPanel';
import FanMobileView from '../components/FanMobileView';
import { initialZones } from '../data/mockZones';
import type { ZoneInfo } from '../data/mockZones';
import { Smartphone, BrainCircuit, Search, Wifi, WifiOff } from 'lucide-react';
import {
    isFirebaseConfigured,
    getFirebaseApp,
} from '../lib/firebase';
import {
    seedZonesIfEmpty,
    subscribeToZones,
    resolveAlert,
    startSimulatedSensorUpdates,
    logAnalyticsEvent,
} from '../lib/zonesService';

export default function Dashboard() {
    const [zones, setZones] = useState<ZoneInfo[]>(initialZones);
    const [selectedZone, setSelectedZone] = useState<ZoneInfo | null>(null);
    const [showMobileView, setShowMobileView] = useState(false);
    const [isForecastMode, setIsForecastMode] = useState(false);
    const [firebaseActive, setFirebaseActive] = useState(false);
    const sensorCleanupRef = useRef<(() => void) | null>(null);

    // ─── Firebase OR Mock realtime data ──────────────────────────────────────
    useEffect(() => {
        if (isForecastMode) return;

        if (isFirebaseConfigured()) {
            // ── FIREBASE PATH ──────────────────────────────────────────────
            let unsubscribeListener: (() => void) | null = null;

            const initFirebase = async () => {
                try {
                    getFirebaseApp(); // ensure initialized
                    await seedZonesIfEmpty();

                    // Subscribe to live DB changes
                    unsubscribeListener = subscribeToZones((liveZones) => {
                        setZones(liveZones);
                    });

                    // Start writing simulated sensor updates to Firebase
                    // (in production this would be replaced by real IoT data)
                    sensorCleanupRef.current = startSimulatedSensorUpdates();

                    setFirebaseActive(true);
                    logAnalyticsEvent('dashboard_opened', { mode: 'live' });
                } catch (err) {
                    console.error('[VenueFlow] Firebase init failed, falling back to mock:', err);
                    startMockUpdates();
                }
            };

            initFirebase();

            return () => {
                unsubscribeListener?.();
                sensorCleanupRef.current?.();
                sensorCleanupRef.current = null;
            };
        } else {
            // ── MOCK FALLBACK PATH (no .env configured) ────────────────────
            return startMockUpdates();
        }
    }, [isForecastMode]);

    /** Local mock updates — used when Firebase is not configured */
    function startMockUpdates(): () => void {
        const interval = setInterval(() => {
            setZones(prev =>
                prev.map(z => {
                    let delta = Math.floor(Math.random() * 21) - 10;
                    if (z.density > 85) delta -= 5;
                    if (z.density < 30) delta += 5;
                    const newDensity = Math.max(10, Math.min(99, z.density + delta));
                    const newAlertLevel =
                        newDensity > 85 ? 'critical' as const :
                        newDensity > 60 ? 'warning'  as const : 'safe' as const;
                    return { ...z, density: newDensity, alertLevel: newAlertLevel, lastUpdated: new Date().toISOString() };
                })
            );
        }, 3000);
        return () => clearInterval(interval);
    }

    // ─── Alert Resolution ─────────────────────────────────────────────────────
    const handleResolveAlert = async (id: string) => {
        if (isForecastMode) return;
        const zone = zones.find(z => z.id === id);
        if (!zone) return;

        if (firebaseActive) {
            // Write resolution to Firebase — all clients see update
            await resolveAlert(zone);
            logAnalyticsEvent('alert_dispatched', { zone_id: id, zone_name: zone.name });
        } else {
            // Local mock resolution
            setZones(prev => prev.map(z =>
                z.id === id
                    ? { ...z, density: Math.max(10, z.density - 40), alertLevel: 'safe', lastUpdated: new Date().toISOString() }
                    : z
            ));
        }
    };

    // ─── Forecast Mode ────────────────────────────────────────────────────────
    const displayZones = useMemo(() => {
        if (!isForecastMode) return zones;
        return zones.map(z => {
            let predicted = z.density;
            if (z.name.includes('Food') || z.name.includes('Restroom') || z.name.includes('Merch')) {
                predicted += 45;
            } else if (z.name.includes('Gate') || z.name.includes('Exit')) {
                predicted -= 30;
            }
            const newDensity = Math.max(5, Math.min(99, predicted));
            return {
                ...z,
                density: newDensity,
                alertLevel: (newDensity > 85 ? 'critical' : newDensity > 60 ? 'warning' : 'safe') as ZoneInfo['alertLevel'],
            };
        });
    }, [zones, isForecastMode]);

    // ─── Zone Click ───────────────────────────────────────────────────────────
    const handleZoneClick = (zone: ZoneInfo) => {
        setSelectedZone(zone);
        logAnalyticsEvent('zone_clicked', { zone_id: zone.id, zone_name: zone.name });
    };

    // ─── Render ───────────────────────────────────────────────────────────────
    return (
        <div className={`min-h-screen p-6 lg:p-8 font-sans transition-colors duration-1000 ${isForecastMode ? 'bg-indigo-950/20 text-white shadow-[inset_0_0_150px_rgba(79,70,229,0.15)]' : 'bg-slate-50'}`}>
            {/* Sidebar */}
            <div className="hidden lg:flex flex-col justify-center fixed left-6 top-0 bottom-0 z-40">
                <Sidebar />
            </div>

            {/* Main Content */}
            <div className="w-full max-w-[1400px] mx-auto flex flex-col gap-8 lg:pl-28">

                {/* Top Nav Bar */}
                <header className="flex items-center justify-between bg-white rounded-[2rem] px-8 py-4 shadow-sm border border-slate-100">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Venue Dashboard</h1>
                        <p className="text-sm text-slate-500 font-medium mt-0.5">14th Aug 2026 • Live Match Operations</p>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Firebase status badge */}
                        <div
                            title={firebaseActive ? 'Connected to Firebase Realtime Database' : 'Running on local mock data'}
                            className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${firebaseActive
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : 'bg-slate-50 text-slate-500 border-slate-200'}`}
                        >
                            {firebaseActive
                                ? <><Wifi className="w-3.5 h-3.5" /> Firebase Live</>
                                : <><WifiOff className="w-3.5 h-3.5" /> Mock Data</>}
                        </div>

                        {/* Search */}
                        <div className="hidden md:flex items-center bg-slate-50 px-4 py-2.5 rounded-full text-slate-400">
                            <Search className="w-5 h-5 mr-2" aria-hidden="true" />
                            <label htmlFor="venue-search" className="sr-only">Search zones</label>
                            <input
                                id="venue-search"
                                type="text"
                                placeholder="Search..."
                                aria-label="Search zones"
                                className="bg-transparent outline-none text-sm w-32 placeholder:text-slate-400"
                            />
                        </div>

                        {/* Live / Forecast toggle */}
                        <div className="flex items-center bg-slate-50 p-1.5 rounded-full shadow-inner border border-slate-100" role="group" aria-label="View mode">
                            <button
                                onClick={() => isForecastMode && setIsForecastMode(false)}
                                aria-pressed={!isForecastMode}
                                className={`px-5 py-2 text-sm font-bold rounded-full transition-all ${!isForecastMode ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Live View
                            </button>
                            <button
                                onClick={() => {
                                    if (!isForecastMode) {
                                        setIsForecastMode(true);
                                        logAnalyticsEvent('forecast_mode_activated');
                                    }
                                }}
                                aria-pressed={isForecastMode}
                                className={`px-5 py-2 text-sm font-bold rounded-full transition-all flex items-center gap-2 ${isForecastMode ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <BrainCircuit className="w-4 h-4" aria-hidden="true" />
                                +15 Min AI
                            </button>
                        </div>

                        {/* Fan view */}
                        <button
                            onClick={() => {
                                setShowMobileView(!showMobileView);
                                logAnalyticsEvent('fan_view_toggled');
                            }}
                            aria-label={showMobileView ? 'Close fan mobile view' : 'Open fan mobile view'}
                            className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-md"
                        >
                            <Smartphone className="w-5 h-5" aria-hidden="true" />
                        </button>

                        {/* Profile */}
                        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                            <div className="text-right hidden sm:block">
                                <div className="text-sm font-bold text-slate-800">Alex Watson</div>
                                <div className="text-xs font-medium text-slate-500">Venue Admin</div>
                            </div>
                            <div
                                className="w-12 h-12 rounded-full bg-indigo-100 border-2 border-white shadow-sm flex items-center justify-center text-indigo-600 font-bold"
                                role="img"
                                aria-label="User avatar: Alex Watson"
                            >
                                AW
                            </div>
                        </div>
                    </div>
                </header>

                {isForecastMode && (
                    <div role="status" aria-live="polite" className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-indigo-700 font-bold shadow-sm animate-pulse">
                        🔮 AI Forecast Mode Active: Simulating density +15 minutes from now (Halftime Scenario)
                    </div>
                )}

                {/* Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
                    <HeatmapGrid zones={displayZones} onZoneClick={handleZoneClick} />

                    <div className="flex flex-col gap-8">
                        <AlertPanel zones={displayZones} onResolveAlert={handleResolveAlert} />
                        <QueuePanel />
                        <RouteSuggestion zones={displayZones} />
                    </div>
                </div>
            </div>

            <ZoneDetailsPanel
                zone={selectedZone}
                onClose={() => setSelectedZone(null)}
            />

            <FanMobileView
                isOpen={showMobileView}
                onClose={() => setShowMobileView(false)}
                zones={displayZones}
            />
        </div>
    );
}
