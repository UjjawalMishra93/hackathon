import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import RouteSuggestion from '../components/RouteSuggestion';
import type { ZoneInfo } from '../data/mockZones';

const makeZone = (id: string, name: string, density: number): ZoneInfo => ({
    id,
    name,
    density,
    capacity: 500,
    alertLevel: density > 85 ? 'critical' : density > 60 ? 'warning' : 'safe',
    lastUpdated: new Date().toISOString(),
});

describe('RouteSuggestion', () => {
    it('renders the "Suggested Route" heading', () => {
        render(<RouteSuggestion zones={[]} />);
        expect(screen.getByText('Suggested Route')).toBeInTheDocument();
    });

    it('suggests Center Aisle via North Exit when North Exit has low density', () => {
        const zones = [
            makeZone('z1', 'North Exit', 40),
            makeZone('z2', 'Gate A', 88),
            makeZone('z3', 'Gate B', 88),
        ];
        render(<RouteSuggestion zones={zones} />);
        expect(screen.getByText('Center Aisle')).toBeInTheDocument();
        expect(screen.getByText('North Exit')).toBeInTheDocument();
    });

    it('suggests East Corridor via Gate B when Gate B has low density', () => {
        const zones = [
            makeZone('z1', 'North Exit', 75),
            makeZone('z2', 'Gate B', 40),
            makeZone('z3', 'Gate A', 88),
        ];
        render(<RouteSuggestion zones={zones} />);
        expect(screen.getByText('East Corridor')).toBeInTheDocument();
        expect(screen.getByText('Gate B')).toBeInTheDocument();
    });

    it('falls back to Upper Catwalk / South Exit when all gates are critical', () => {
        const zones = [
            makeZone('z1', 'North Exit', 90),
            makeZone('z2', 'Gate A', 90),
            makeZone('z3', 'Gate B', 90),
        ];
        render(<RouteSuggestion zones={zones} />);
        expect(screen.getByText('Upper Catwalk')).toBeInTheDocument();
        expect(screen.getByText('South Exit')).toBeInTheDocument();
    });

    it('always renders the starting point "Seat B12"', () => {
        render(<RouteSuggestion zones={[makeZone('z1', 'Gate A', 30)]} />);
        expect(screen.getByText('Seat B12')).toBeInTheDocument();
    });

    it('renders a time savings badge', () => {
        const zones = [makeZone('z1', 'North Exit', 30)];
        render(<RouteSuggestion zones={zones} />);
        expect(screen.getByText(/Saves ~\d+ mins/)).toBeInTheDocument();
    });
});
