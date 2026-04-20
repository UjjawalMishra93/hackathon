import { Activity, LayoutDashboard, Map, Bell, Settings, LogOut } from 'lucide-react';

export default function Sidebar() {
    return (
        <aside className="w-24 bg-slate-900 rounded-[2rem] flex flex-col items-center py-8 gap-10 shadow-xl shadow-slate-300">
            {/* Logo */}
            <div className="bg-white p-2.5 rounded-2xl shadow-sm text-indigo-600" aria-hidden="true">
                <Activity className="w-7 h-7" />
            </div>

            {/* Nav Links */}
            <nav className="flex-1 flex flex-col items-center gap-6 w-full" aria-label="Main Navigation">
                <button aria-label="Dashboard" className="p-3 bg-white/20 text-white rounded-xl transition-colors w-12 h-12 flex justify-center items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
                    <LayoutDashboard className="w-5 h-5" aria-hidden="true" />
                </button>
                <button aria-label="Map View" className="p-3 text-slate-400 hover:text-white transition-colors w-12 h-12 flex justify-center items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
                    <Map className="w-5 h-5" aria-hidden="true" />
                </button>
                <button aria-label="Alerts" className="p-3 text-slate-400 hover:text-white transition-colors w-12 h-12 flex justify-center items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
                    <Bell className="w-5 h-5" aria-hidden="true" />
                </button>
                <button aria-label="Settings" className="p-3 text-slate-400 hover:text-white transition-colors w-12 h-12 flex justify-center items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
                    <Settings className="w-5 h-5" aria-hidden="true" />
                </button>
            </nav>

            {/* Bottom Avatar / Logout */}
            <button aria-label="Log Out" className="p-2 text-slate-400 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded">
                <LogOut className="w-5 h-5" aria-hidden="true" />
            </button>
        </aside>
    );
}
