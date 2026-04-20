import { useState, useEffect } from 'react';
import { Timer, Coffee, Utensils, Droplets } from 'lucide-react';
import { motion } from 'framer-motion';

export default function QueuePanel() {
    const [queues, setQueues] = useState([
        { id: 'burger', name: 'Burger Stand', icon: <Utensils className="w-5 h-5" />, eta: 4 },
        { id: 'coffee', name: 'Coffee Shop', icon: <Coffee className="w-5 h-5" />, eta: 1 },
        { id: 'washroom', name: 'Washrooms', icon: <Droplets className="w-5 h-5" />, eta: 3 },
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            setQueues(prev =>
                prev.map(q => ({
                    ...q,
                    eta: Math.max(1, q.eta + (Math.random() > 0.5 ? 1 : -1))
                }))
            );
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-white rounded-[2rem] p-8 shadow-sm" aria-labelledby="queue-panel-title" role="region">
            <h2 id="queue-panel-title" className="text-xl font-bold mb-6 flex items-center gap-3 text-slate-800 tracking-tight">
                <div className="p-2 bg-indigo-50 text-indigo-500 rounded-xl" aria-hidden="true">
                    <Timer className="w-5 h-5" />
                </div>
                Live Queue ETAs
            </h2>

            <div className="space-y-6">
                {queues.map(queue => (
                    <div key={queue.id} className="flex flex-col gap-3">
                        <div className="flex justify-between items-center font-bold text-slate-700">
                            <span className="flex items-center gap-3">
                                <div className="p-2 bg-slate-50 text-slate-400 rounded-lg" aria-hidden="true">
                                    {queue.icon}
                                </div>
                                {queue.name}
                            </span>
                            <motion.span
                                key={queue.eta}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                aria-label={`ETA ${queue.eta} minutes`}
                                className={`px-3 py-1 rounded-full text-xs font-bold ${queue.eta > 4 ? 'bg-red-100 text-red-700' :
                                    queue.eta > 2 ? 'bg-orange-100 text-orange-700' :
                                        'bg-green-100 text-green-700'
                                    }`}
                            >
                                {queue.eta} min
                            </motion.span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden" role="progressbar" aria-valuenow={queue.eta} aria-valuemin={0} aria-valuemax={15}>
                            <motion.div
                                className={`h-full rounded-full ${queue.eta > 4 ? 'bg-red-500' :
                                    queue.eta > 2 ? 'bg-orange-500' :
                                        'bg-green-500'
                                    }`}
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(100, queue.eta * 15)}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
