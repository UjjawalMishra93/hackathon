import { describe, it, expect } from 'vitest';
import { initialZones } from '../data/mockZones';
import type { ZoneInfo } from '../data/mockZones';

describe('mockZones data', () => {
    it('exports a non-empty initialZones array', () => {
        expect(initialZones).toBeDefined();
        expect(initialZones.length).toBeGreaterThan(0);
    });

    it('every zone has required fields: id, name, density', () => {
        initialZones.forEach((zone: ZoneInfo) => {
            expect(zone).toHaveProperty('id');
            expect(zone).toHaveProperty('name');
            expect(zone).toHaveProperty('density');
        });
    });

    it('zone density values are between 0 and 100', () => {
        initialZones.forEach((zone: ZoneInfo) => {
            expect(zone.density).toBeGreaterThanOrEqual(0);
            expect(zone.density).toBeLessThanOrEqual(100);
        });
    });

    it('all zone ids are unique', () => {
        const ids = initialZones.map((z: ZoneInfo) => z.id);
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size).toBe(ids.length);
    });

    it('zone names are non-empty strings', () => {
        initialZones.forEach((zone: ZoneInfo) => {
            expect(typeof zone.name).toBe('string');
            expect(zone.name.trim().length).toBeGreaterThan(0);
        });
    });

    it('contains expected venue zones', () => {
        const names = initialZones.map((z: ZoneInfo) => z.name);
        expect(names).toContain('Gate A');
        expect(names).toContain('Gate B');
        expect(names).toContain('Food Zone');
    });
});
