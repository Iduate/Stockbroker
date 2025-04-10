'use client';

import { type SectorType } from '../types';

interface SectorSelectorProps {
  sectors: SectorType[];
  selectedSector: SectorType;
  onSelectSector: (sector: SectorType) => void;
}

export default function SectorSelector({
  sectors,
  selectedSector,
  onSelectSector,
}: SectorSelectorProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Sectors</h3>
      <div className="space-y-2">
        {sectors.map((sector) => (
          <button
            key={sector}
            onClick={() => onSelectSector(sector)}
            className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
              selectedSector === sector
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            {sector}
          </button>
        ))}
      </div>
    </div>
  );
} 