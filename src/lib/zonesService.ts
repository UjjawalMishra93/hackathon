/**
 * zonesService.ts
 *
 * Service layer for all Firebase Realtime Database operations on /zones.
 * Provides:
 *  - subscribeToZones()   — live listener (replaces setInterval)
 *  - resolveAlert()       — write a density drop back to Firebase
 *  - seedZones()          — one-time DB population on first load
 *  - logAnalyticsEvent()  — wraps Firebase Analytics logEvent
 */

import {
    ref,
    set,
    update,
    onValue,
    off,
    type DatabaseReference,
} from 'firebase/database';
import { logEvent } from 'firebase/analytics';
import { getFirebaseDB, getFirebaseAnalytics } from './firebase';
import { initialZones, type ZoneInfo } from '../data/mockZones';

const ZONES_PATH = 'zones';

// ─── Seed ────────────────────────────────────────────────────────────────────

/**
 * Writes initialZones into Firebase if the /zones node doesn't have data yet.
 * Safe to call on every mount — only writes when the node is empty.
 */
export async function seedZonesIfEmpty(): Promise<void> {
    const db = getFirebaseDB();
    const zonesRef = ref(db, ZONES_PATH);

    return new Promise((resolve) => {
        // Read once to check if data exists
        onValue(
            zonesRef,
            (snapshot) => {
                off(zonesRef); // detach immediately — one-time read
                if (!snapshot.exists()) {
                    const seedData: Record<string, ZoneInfo> = {};
                    initialZones.forEach((zone) => {
                        seedData[zone.id] = zone;
                    });
                    set(zonesRef, seedData)
                        .then(() => console.log('[VenueFlow] Firebase seeded with initial zone data.'))
                        .catch(console.error)
                        .finally(resolve);
                } else {
                    resolve();
                }
            },
            { onlyOnce: true }
        );
    });
}

// ─── Subscribe ───────────────────────────────────────────────────────────────

/**
 * Attaches a real-time listener to /zones.
 * @param onUpdate  - callback receives the full zones array on every change
 * @returns unsubscribe function — call on component unmount
 */
export function subscribeToZones(onUpdate: (zones: ZoneInfo[]) => void): () => void {
    const db = getFirebaseDB();
    const zonesRef: DatabaseReference = ref(db, ZONES_PATH);

    const handler = onValue(zonesRef, (snapshot) => {
        if (!snapshot.exists()) return;
        const data = snapshot.val() as Record<string, ZoneInfo>;
        const zones = Object.values(data).sort((a, b) => a.id.localeCompare(b.id));
        onUpdate(zones);
    });

    // Return cleanup function for useEffect
    return () => off(zonesRef, 'value', handler);
}

// ─── Resolve Alert ────────────────────────────────────────────────────────────

/**
 * Drops a zone's density by 40% (min 10) to simulate crowd dispersal.
 * Writes directly to Firebase so all connected clients see the update.
 */
export async function resolveAlert(zone: ZoneInfo): Promise<void> {
    const db = getFirebaseDB();
    const newDensity = Math.max(10, zone.density - 40);
    const newAlertLevel = newDensity > 85 ? 'critical' : newDensity > 60 ? 'warning' : 'safe';

    await update(ref(db, `${ZONES_PATH}/${zone.id}`), {
        density: newDensity,
        alertLevel: newAlertLevel,
        lastUpdated: new Date().toISOString(),
    });

    logAnalyticsEvent('alert_resolved', { zone_id: zone.id, zone_name: zone.name });
}

// ─── Simulated Realtime Updates (writes to Firebase) ─────────────────────────

/**
 * Periodically mutates zone densities in Firebase, simulating IoT sensor data.
 * This is what drives the real-time updates all subscribers see.
 * Only one instance should run per app session.
 */
export function startSimulatedSensorUpdates(): () => void {
    const db = getFirebaseDB();

    const interval = setInterval(async () => {
        const zonesRef = ref(db, ZONES_PATH);
        onValue(
            zonesRef,
            async (snapshot) => {
                off(zonesRef, 'value');
                if (!snapshot.exists()) return;

                const data = snapshot.val() as Record<string, ZoneInfo>;
                const updates: Record<string, any> = {};

                Object.entries(data).forEach(([id, zone]) => {
                    let delta = Math.floor(Math.random() * 21) - 10;
                    if (zone.density > 85) delta -= 5;
                    if (zone.density < 30) delta += 5;
                    const newDensity = Math.max(10, Math.min(99, zone.density + delta));
                    const newAlertLevel = newDensity > 85 ? 'critical' : newDensity > 60 ? 'warning' : 'safe';

                    updates[`${ZONES_PATH}/${id}/density`]     = newDensity;
                    updates[`${ZONES_PATH}/${id}/alertLevel`]  = newAlertLevel;
                    updates[`${ZONES_PATH}/${id}/lastUpdated`] = new Date().toISOString();
                });

                try {
                    await update(ref(db), updates);
                } catch (err) {
                    console.error('[VenueFlow] Sensor update write failed:', err);
                }
            },
            { onlyOnce: true }
        );
    }, 3000);

    return () => clearInterval(interval);
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export function logAnalyticsEvent(
    eventName: string,
    params?: Record<string, string | number | boolean>
): void {
    const a = getFirebaseAnalytics();
    if (a) {
        logEvent(a, eventName, params);
    }
}
