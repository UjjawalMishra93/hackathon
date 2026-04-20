import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function AICameraFeed({ density }: { density: number }) {
    const [points, setPoints] = useState<{ x: number; y: number; w: number; h: number }[]>([]);

    useEffect(() => {
        const count = Math.floor((density / 100) * 15) + 2;
        const newPoints = Array.from({ length: count }).map(() => ({
            x: Math.random() * 80 + 10,
            y: Math.random() * 60 + 20,
            w: Math.random() * 10 + 5,
            h: Math.random() * 15 + 10,
        }));
        setPoints(newPoints);
    }, [density]);

    const videoSource = density > 75
        ? 'https://drive.usercontent.google.com/download?id=1P8TZCLYd3R9Z8n63LhHYt97biHhHdXd_&export=download'
        : 'https://drive.usercontent.google.com/download?id=1PkFOLZb3-cmEDrn3OPl3J5xYlyJ2YNnt&export=download';

    const personCount = Math.floor((density / 100) * 15) + 2;

    return (
        // aria-label provides a meaningful description for screen readers
        // role="img" treats the whole feed as a single image-like element
        <div
            className="relative w-full h-48 bg-slate-900 rounded-2xl overflow-hidden shadow-inner isolate group"
            role="img"
            aria-label={`AI camera feed detecting approximately ${personCount} people. Zone occupancy at ${density}%.`}
        >
            {/* Decorative video — hidden from AT, described by the parent aria-label */}
            <video
                key={videoSource}
                autoPlay
                loop
                muted
                playsInline
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-screen group-hover:opacity-100 transition-opacity duration-700 filter contrast-125 saturate-50"
            >
                <source src={videoSource} type="video/mp4" />
            </video>

            {/* All overlays are decorative — hidden from screen readers */}
            <div className="absolute inset-0 bg-blue-900/10 pointer-events-none" aria-hidden="true" />

            {/* Status Badge */}
            <div
                className="absolute top-3 left-3 flex items-center gap-2 z-10 bg-black/60 backdrop-blur-sm px-2.5 py-1.5 rounded-lg text-[10px] text-white uppercase tracking-wider font-mono shadow-sm"
                aria-hidden="true"
            >
                <span className="w-2 h-2 rounded-full animate-pulse bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                REC • Zone CV
            </div>

            {/* Bounding Boxes — decorative AI overlay */}
            <div aria-hidden="true">
                {points.map((p, i) => (
                    <motion.div
                        key={i}
                        className="absolute border border-indigo-400 bg-indigo-400/10 rounded-sm z-10 shadow-[0_0_5px_rgba(99,102,241,0.5)]"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            x: [0, (Math.random() - 0.5) * 10, 0],
                            y: [0, (Math.random() - 0.5) * 10, 0],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            repeatType: 'reverse',
                        }}
                        style={{
                            left: `${p.x}%`,
                            top: `${p.y}%`,
                            width: `${p.w}%`,
                            height: `${p.h}%`,
                        }}
                    >
                        <div className="absolute -top-4 left-0 text-[8px] bg-indigo-500 text-white px-1.5 py-0.5 rounded-t-sm font-mono tracking-tighter whitespace-nowrap opacity-80">
                            Human {(85 + i * 1.1).toFixed(1)}%
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Scanner Line — decorative */}
            <motion.div
                className="absolute left-0 right-0 h-0.5 bg-indigo-400 shadow-[0_0_12px_rgba(99,102,241,1)] z-20"
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                aria-hidden="true"
            />
        </div>
    );
}
