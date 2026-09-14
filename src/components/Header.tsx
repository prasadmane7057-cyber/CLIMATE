import React, { useState, useEffect } from 'react';
import { ZoneData, EngineMode } from '../types';

interface HeaderProps {
  activeZone: ZoneData;
  engineMode: EngineMode;
  onToggleEngine: () => void;
  onNotify: (msg: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeZone,
  engineMode,
  onToggleEngine,
  onNotify
}) => {
  const [sysCycle, setSysCycle] = useState(12.8);

  useEffect(() => {
    const timer = setInterval(() => {
      setSysCycle(prev => +(prev + 0.1 > 15 ? 12.0 : prev + 0.1).toFixed(1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="fixed top-0 w-full z-40 bg-[#0e1321]/95 backdrop-blur-xl border-b border-[#252a39] shadow-[0_1px_8px_rgba(0,0,0,0.4)]">
      {/* Main App Bar */}
      <div className="h-16 px-4 flex items-center justify-between gap-3">
        {/* Left: Brand & Zone Status */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-[#1a1f2e] border border-[#3e4850] flex items-center justify-center shrink-0 text-[#89ceff] shadow-inner">
            <span className="material-symbols-outlined text-[24px]">radar</span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-['Inter'] text-[16px] font-bold tracking-tight text-[#dee2f6]">
                CLIMAFORGE
              </span>
              <span className={`font-['JetBrains_Mono'] text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                activeZone.id === 'A' 
                  ? 'bg-[#93000a] text-[#ffdad6] animate-pulse border border-[#ffb4ab]/40' 
                  : activeZone.id === 'B' 
                  ? 'bg-[#d88a00] text-[#4a2c00]' 
                  : 'bg-[#252a39] text-[#89ceff]'
              }`}>
                {activeZone.name}: {activeZone.id === 'A' ? 'CRITICAL' : activeZone.id === 'B' ? 'HIGH' : activeZone.id === 'C' ? 'MOD' : 'LOW'}
              </span>
            </div>
            <span className="font-['Inter'] text-[11px] text-[#bec8d2] truncate">
              Climate Consequence &amp; Intervention
            </span>
          </div>
        </div>

        {/* Right: Engine Telemetry & Profile */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex flex-col items-end mr-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0ea5e9] animate-ping" />
              <span className="font-['JetBrains_Mono'] text-[10px] font-bold text-[#89ceff] uppercase tracking-wider">
                {engineMode === 'NUGEN' ? 'LIVE NUGEN' : engineMode === 'GEMINI' ? 'GEMINI 3.8' : 'HEURISTIC'}
              </span>
            </div>
            <span className="font-['JetBrains_Mono'] text-[11px] text-[#88929b]">
              99.4% FI CALIBRATION
            </span>
          </div>

          <button 
            onClick={() => onNotify("EOC Incident Commander profile: Operational Level 4 Clearance.")}
            className="w-8 h-8 rounded-full bg-[#89ceff] hover:bg-[#c9e6ff] flex items-center justify-center shrink-0 transition-colors shadow-sm"
            title="Incident Commander Profile"
          >
            <span className="material-symbols-outlined text-[#00344d] text-[18px]">person</span>
          </button>
        </div>
      </div>

      {/* Operational Telemetry Sub-Ribbon */}
      <div className="px-4 py-1.5 bg-[#090e1c] border-t border-[#1e2638] flex items-center justify-between text-xs overflow-x-auto select-none">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-[#ffb4ab] animate-ping shrink-0" />
          <span className="font-['JetBrains_Mono'] text-[11px] text-[#ffb4ab] uppercase font-bold tracking-wider whitespace-nowrap">
            CRISIS DISPATCH ACTIVE
          </span>
          <span className="hidden md:inline font-['JetBrains_Mono'] text-[11px] text-[#88929b]">
            | SYS_CYCLE: {sysCycle}s
          </span>
          <span className="hidden lg:inline font-['JetBrains_Mono'] text-[11px] text-[#bec8d2]">
            | UTC 04:11:02Z
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 bg-[#1a1f2e] border border-[#3e4850] px-2 py-0.5 rounded">
            <span className="material-symbols-outlined text-[14px] text-[#89ceff]">bolt</span>
            <span className="font-['JetBrains_Mono'] text-[10px] font-bold text-[#89ceff]">
              {engineMode === 'NUGEN' 
                ? 'NUGEN v4.2 DETERMINISTIC' 
                : engineMode === 'GEMINI' 
                ? 'GEMINI 3.8 FLASH ADVISORY' 
                : 'HEURISTIC STATISTICAL FALLBACK'}
            </span>
          </div>

          <button
            onClick={onToggleEngine}
            className="bg-[#252a39] hover:bg-[#303444] text-[#bec8d2] hover:text-[#dee2f6] px-2 py-0.5 rounded font-['JetBrains_Mono'] text-[10px] font-semibold flex items-center gap-1 transition-colors border border-[#3e4850]"
            title="Toggle between Deterministic NUGEN and Fallback engine modes"
          >
            <span className="material-symbols-outlined text-[12px]">tune</span>
            <span>{engineMode === 'NUGEN' ? 'TOGGLE FALLBACK' : engineMode === 'FALLBACK' ? 'TOGGLE GEMINI' : 'TOGGLE NUGEN'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
