import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import HeatmapGrid from '../components/HeatmapGrid';
import type { ZoneInfo } from '../data/mockZones';

const makeZone = (id: string, name: string, density: number): ZoneInfo => ({
    id,
    name,
    density,
    capacity: 500,
    alertLevel: density > 85 ? 'critical' : density > 60 ? 'warning' : 'safe',
    lastUpdated: new Date().toISOString(),
});

describe('HeatmapGrid', () => {
    it('renders the "Live Overview" heading', () => {
        render(<HeatmapGrid zones={[]} />);
        expect(screen.getByText('Live Overview')).toBeInTheDocument();
    });

    it('shows "System Live" indicator', () => {
        render(<HeatmapGrid zones={[]} />);
        expect(screen.getByText('System Live')).toBeInTheDocument();
    });

    it('renders a ZoneCard for each zone', () => {
        const zones = [
            makeZone('z1', 'Gate A', 92),
            makeZone('z2', 'Food Zone', 64),
            makeZone('z3', 'Gate B', 20),
        ];
        render(<HeatmapGrid zones={zones} />);
        expect(screen.getByText('Gate A')).toBeInTheDocument();
        expect(screen.getByText('Food Zone')).toBeInTheDocument();
        expect(screen.getByText('Gate B')).toBeInTheDocument();
    });

    it('renders an empty grid gracefully with zero zones', () => {
        const { container } = render(<HeatmapGrid zones={[]} />);
        // Grid should exist even when empty
        expect(container.querySelector('.grid')).toBeInTheDocument();
    });

    it('renders 6 zone cards when given 6 zones', () => {
        const zones = Array.from({ length: 6 }, (_, i) =>
            makeZone(`z${i}`, `Zone ${i}`, 30 + i * 10)
        );
        render(<HeatmapGrid zones={zones} />);
        zones.forEach((z) => {
            expect(screen.getByText(z.name)).toBeInTheDocument();
        });
    });
});
