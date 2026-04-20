export interface ZoneInfo {
    id: string;
    name: string;
    density: number;
    capacity: number;
    alertLevel: 'safe' | 'warning' | 'critical';
    lastUpdated: string;
}

export const initialZones: ZoneInfo[] = [
    { id: 'z1', name: 'Gate A',      density: 88, capacity: 1200, alertLevel: 'critical', lastUpdated: new Date().toISOString() },
    { id: 'z2', name: 'Food Zone',   density: 64, capacity: 400,  alertLevel: 'warning',  lastUpdated: new Date().toISOString() },
    { id: 'z3', name: 'Gate B',      density: 20, capacity: 1200, alertLevel: 'safe',     lastUpdated: new Date().toISOString() },
    { id: 'z4', name: 'Restroom',    density: 72, capacity: 150,  alertLevel: 'warning',  lastUpdated: new Date().toISOString() },
    { id: 'z5', name: 'North Exit',  density: 45, capacity: 600,  alertLevel: 'safe',     lastUpdated: new Date().toISOString() },
    { id: 'z6', name: 'Merch Stand', density: 92, capacity: 200,  alertLevel: 'critical', lastUpdated: new Date().toISOString() },
];

