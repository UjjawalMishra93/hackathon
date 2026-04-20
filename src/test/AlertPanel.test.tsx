import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AlertPanel from '../components/AlertPanel';
import type { ZoneInfo } from '../data/mockZones';

const makeZone = (id: string, name: string, density: number): ZoneInfo => ({
    id,
    name,
    density,
    capacity: 500,
    alertLevel: density > 85 ? 'critical' : density > 60 ? 'warning' : 'safe',
    lastUpdated: new Date().toISOString(),
});

describe('AlertPanel', () => {
    it('shows "All Systems Nominal" when no zones are critical or warning', () => {
        const zones = [makeZone('z1', 'Gate A', 30), makeZone('z2', 'Gate B', 20)];
        render(<AlertPanel zones={zones} />);
        expect(screen.getByText('All Systems Nominal')).toBeInTheDocument();
    });

    it('shows critical alert when a zone density exceeds 85', () => {
        const zones = [makeZone('z1', 'Gate A', 92)];
        render(<AlertPanel zones={zones} />);
        expect(screen.getByText('Critical Capacity')).toBeInTheDocument();
        expect(screen.getByText(/Gate A usage at 92%/)).toBeInTheDocument();
    });

    it('shows "Elevated Traffic" for warning zones when no critical zones exist', () => {
        const zones = [makeZone('z1', 'Food Zone', 72)];
        render(<AlertPanel zones={zones} />);
        expect(screen.getByText('Elevated Traffic')).toBeInTheDocument();
    });

    it('renders multiple critical alerts for multiple critical zones', () => {
        const zones = [makeZone('z1', 'Gate A', 92), makeZone('z2', 'Merch Stand', 95)];
        render(<AlertPanel zones={zones} />);
        expect(screen.getAllByText('Critical Capacity')).toHaveLength(2);
    });

    it('calls onResolveAlert with the correct zone id when Dispatch is clicked', () => {
        const handleResolve = vi.fn();
        const zones = [makeZone('z1', 'Gate A', 92)];
        render(<AlertPanel zones={zones} onResolveAlert={handleResolve} />);
        const button = screen.getByText(/Dispatch Response/i);
        fireEvent.click(button);
        expect(handleResolve).toHaveBeenCalledWith('z1');
    });

    it('does not render Dispatch button when onResolveAlert is not provided', () => {
        const zones = [makeZone('z1', 'Gate A', 92)];
        render(<AlertPanel zones={zones} />);
        expect(screen.queryByText(/Dispatch Response/i)).not.toBeInTheDocument();
    });

    it('renders the panel heading', () => {
        render(<AlertPanel zones={[]} />);
        expect(screen.getByText('Incident Alerts')).toBeInTheDocument();
    });
});
