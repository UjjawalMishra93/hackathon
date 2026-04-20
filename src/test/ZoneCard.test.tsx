import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ZoneCard from '../components/ZoneCard';
import type { ZoneInfo } from '../data/mockZones';

const criticalZone: ZoneInfo = { id: 'z1', name: 'Gate A', density: 92, capacity: 500, alertLevel: 'critical', lastUpdated: new Date().toISOString() };
const busyZone: ZoneInfo = { id: 'z2', name: 'Food Zone', density: 70, capacity: 300, alertLevel: 'warning', lastUpdated: new Date().toISOString() };
const safeZone: ZoneInfo = { id: 'z3', name: 'Gate B', density: 20, capacity: 400, alertLevel: 'safe', lastUpdated: new Date().toISOString() };

describe('ZoneCard', () => {
    it('renders the zone name correctly', () => {
        render(<ZoneCard zone={criticalZone} />);
        expect(screen.getByText('Gate A')).toBeInTheDocument();
    });

    it('displays the density percentage', () => {
        render(<ZoneCard zone={criticalZone} />);
        expect(screen.getByText('92%')).toBeInTheDocument();
    });

    it('shows "Critical" status when density > 85', () => {
        render(<ZoneCard zone={criticalZone} />);
        expect(screen.getByText('Critical')).toBeInTheDocument();
    });

    it('shows "Busy" status when density is between 61 and 85', () => {
        render(<ZoneCard zone={busyZone} />);
        expect(screen.getByText('Busy')).toBeInTheDocument();
    });

    it('shows "Normal" status when density <= 60', () => {
        render(<ZoneCard zone={safeZone} />);
        expect(screen.getByText('Normal')).toBeInTheDocument();
    });

    it('calls onClick when the card is clicked', () => {
        const handleClick = vi.fn();
        render(<ZoneCard zone={criticalZone} onClick={handleClick} />);
        fireEvent.click(screen.getByText('Gate A'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('renders without crashing when onClick is not provided', () => {
        expect(() => render(<ZoneCard zone={safeZone} />)).not.toThrow();
    });
});
