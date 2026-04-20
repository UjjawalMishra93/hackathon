import { Activity, Smartphone, BrainCircuit } from 'lucide-react';

interface HeaderProps {
    onToggleMobileView?: () => void;
    isForecastMode: boolean;
    onToggleForecast: () => void;
}

export default function Header({ onToggleMobileView, isForecastMode, onToggleForecast }: HeaderProps) {
    return (
        <header className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div className="flex items-center gap-3">
                <Activity className="w-6 h-6 text-indigo-500" />
                <h1 className="text-xl font-bold tracking-wider text-white">VenueFlow AI</h1>
            </div>
            <div className="flex items-center gap-4">

                {/* AI Forecast Toggle */}
                <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-1 mr-4" role="group" aria-label="Forecast View Toggle">
                    <button
                        onClick={() => isForecastMode && onToggleForecast()}
                        aria-pressed={!isForecastMode}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${!isForecastMode ? 'bg-zinc-800 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        Live View
                    </button>
                    <button
                        onClick={() => !isForecastMode && onToggleForecast()}
                        aria-pressed={isForecastMode}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${isForecastMode ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-[0_0_10px_rgba(99,102,241,0.2)]' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        <BrainCircuit className="w-3.5 h-3.5" aria-hidden="true" />
                        +15 Min Forecast
                    </button>
                </div>

                {onToggleMobileView && (
                    <button
                        onClick={onToggleMobileView}
                        aria-label="Preview Fan App Mobile View"
                        className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    >
                        <Smartphone className="w-4 h-4" aria-hidden="true" />
                        Preview Fan App
                    </button>
                )}
            </div>
        </header>
    );
}
