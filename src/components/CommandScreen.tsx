import React from 'react';
import { ZoneData, ZoneId, EngineMode, TacticalResources } from '../types';
import { ZONES_DATA } from '../data/initialData';
import { TacticalMap } from './TacticalMap';

interface CommandScreenProps {
  selectedZone: ZoneData;
  onSelectZone: (id: ZoneId) => void;
  resources: TacticalResources;
  onUpdateResources: (updates: Partial<TacticalResources>) => void;
  onResetResources: () => void;
  engineMode: EngineMode;
  isSimulated: boolean;
  onToggleSimulate: () => void;
  onOpenNodeModal: () => void;
  onOpenActionModal: () => void;
  onGeneratePlan: () => void;
  onNotify: (msg: string) => void;
}

export const CommandScreen: React.FC<CommandScreenProps> = ({
  selectedZone,
  onSelectZone,
  resources,
  onUpdateResources,
  onResetResources,
  engineMode,
  isSimulated,
  onToggleSimulate,
  onOpenNodeModal,
  onOpenActionModal,
  onGeneratePlan,
  onNotify
}) => {
  // Dynamic recalculations based on pumps and simulation state
  let computedRisk = selectedZone.score;
  let computedCascade = selectedZone.cascade;
  let computedClosure = selectedZone.closure;

  if (resources.pumps === 1) {
    computedRisk = Math.min(100, computedRisk + 6);
    computedCascade = Math.min(99, computedCascade + 4);
    computedClosure = Math.min(96, computedClosure + 7);
  } else if (resources.pumps >= 3) {
    computedRisk = Math.max(15, computedRisk - 14);
    computedCascade = Math.max(20, computedCascade - 22);
    computedClosure = Math.max(18, computedClosure - 25);
  }

  if (isSimulated) {
    computedRisk = Math.max(12, Math.floor(computedRisk * 0.42));
    computedCascade = Math.max(10, Math.floor(computedCascade * 0.35));
    computedClosure = Math.max(8, Math.floor(computedClosure * 0.28));
  }

  // Determine severity label and colors
  let severityLabel = computedRisk > 75 ? 'CRITICAL BREACH' : computedRisk > 45 ? 'ELEVATED RISK' : 'STABILIZED';
  let severityTextColor = computedRisk > 75 ? 'text-[#ffb4ab]' : computedRisk > 45 ? 'text-[#ffb95f]' : 'text-[#34d399]';
  let severityBadgeBg = computedRisk > 75 ? 'bg-[#93000a] text-[#ffdad6]' : computedRisk > 45 ? 'bg-[#d88a00] text-[#4a2c00]' : 'bg-[#064e3b] text-[#34d399]';

  // Dynamic recommendation text
  let directiveText = '"Deploy 1 high-capacity mobile pump directly to Culvert C-4 inlet at Main Junction A while staging 2 barrier units on 4th Ave."';
  let rationaleText = 'Main Junction A represents the apex leverage point (9.4 score). Protecting this conduit averts gridlock on the designated hospital trauma corridor.';
  let payoffText = 'Averts 78% downstream congestion; trauma transit maintained within 4 min';
  let payoffClass = 'text-[#89ceff]';

  if (resources.pumps === 1) {
    directiveText = '"CRITICAL DEFICIT DETECTED: 1 Pump is insufficient to prevent Culvert C-4 backflow. Reallocate 1 additional pump immediately or dispatch emergency barricade reinforcements."';
    rationaleText = 'Warning: With only 1 pump active, Culvert C-4 runs at 118% load, resulting in 18cm surface water over the St. Jude ambulance route within 11 minutes.';
    payoffText = 'High risk: Ambulance response delayed by +14 min without 2nd unit';
    payoffClass = 'text-[#ffb4ab]';
  } else if (resources.pumps >= 3) {
    directiveText = '"SURPLUS INTERVENTION: Deploy 2 pumps to Culvert C-4 and 1 pump to Substation 9 relief canal to prevent auxiliary electrical tripping."';
    rationaleText = 'Optimal Leverage: 3 units guarantee 100% dry pavement on trauma route and protect auxiliary city power grid.';
    payoffText = 'Averts 96% downstream disruption; road water depth 0.0cm';
    payoffClass = 'text-[#34d399]';
  }

  if (isSimulated) {
    directiveText = '"[SIMULATION ACTIVE] Dynamic water diversion modeled. Flood peak mitigated; emergency lane integrity validated at 99.4% confidence."';
    payoffText = 'Simulated Outcome: Zero trauma vehicle delays achieved.';
    payoffClass = 'text-[#34d399]';
  }

  return (
    <div className="flex flex-col gap-4 p-4 max-w-5xl mx-auto w-full">
      {/* 1. Zone Selector Bar */}
      <section className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#89ceff]">pin_drop</span>
            <span className="font-['JetBrains_Mono'] text-[10px] text-[#bec8d2] font-bold uppercase tracking-wider">
              TACTICAL JURISDICTION ZONES
            </span>
          </div>
          <span className="font-['JetBrains_Mono'] text-[11px] text-[#88929b]">
            SELECT SECTOR TO BIND HUD
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(['A', 'B', 'C', 'D'] as ZoneId[]).map(id => {
            const z = ZONES_DATA[id];
            const isSelected = selectedZone.id === id;
            return (
              <button
                key={id}
                onClick={() => onSelectZone(id)}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all text-left ${
                  isSelected
                    ? 'bg-[#303444] border-[#89ceff] shadow-md ring-1 ring-[#89ceff]/50'
                    : 'bg-[#1a1f2e] border-[#252a39] hover:bg-[#252a39]'
                }`}
              >
                <div className="flex flex-col min-w-0">
                  <span className="font-['Inter'] text-[15px] font-bold text-[#dee2f6]">
                    {z.name}
                  </span>
                  <span className="font-['Inter'] text-[12px] text-[#bec8d2] truncate">
                    {z.label}
                  </span>
                </div>
                <div className="flex flex-col items-end shrink-0">
                  <span className={`font-['JetBrains_Mono'] text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    id === 'A' ? 'bg-[#ffb4ab] text-[#68000a] animate-pulse' :
                    id === 'B' ? 'bg-[#d88a00] text-[#ffddb8]' :
                    id === 'C' ? 'bg-[#3e4850] text-[#dee2f6]' :
                    'bg-[#090e1c] text-[#89ceff]'
                  }`}>
                    {z.score} {id === 'A' ? 'CRIT' : id === 'B' ? 'HIGH' : id === 'C' ? 'MOD' : 'LOW'}
                  </span>
                  <span className={`font-['JetBrains_Mono'] text-[11px] mt-0.5 ${id === 'A' ? 'text-[#ffb4ab]' : id === 'B' ? 'text-[#ffb95f]' : 'text-[#88929b]'}`}>
                    {id === 'A' ? '+4.2m flood' : id === 'B' ? '+1.8m spill' : id === 'C' ? '+0.4m tide' : 'NOMINAL'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. Interactive Urban Flood GIS Vector Simulator Map */}
      <TacticalMap
        zone={selectedZone}
        pumps={resources.pumps}
        barricades={resources.barricades}
        isSimulated={isSimulated}
        onOpenApexNodeModal={onOpenNodeModal}
        onNotify={onNotify}
      />

      {/* 3. Deterministic Flood Risk Panel */}
      <section className="flex flex-col bg-[#1a1f2e] rounded-xl p-4 border border-[#252a39] shadow-md gap-4">
        <div className="flex items-start justify-between flex-wrap gap-2">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#ffb4ab]">warning</span>
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#bec8d2] font-bold uppercase tracking-wider">
                DETERMINISTIC EVALUATION ENGINE
              </span>
            </div>
            <h2 className="font-['Inter'] text-[18px] font-semibold text-[#dee2f6] mt-0.5">
              Flood Risk Telemetry Vector
            </h2>
          </div>

          {/* Risk Score Large Badge */}
          <div className="flex flex-col items-end">
            <div className={`flex items-baseline gap-1 px-3 py-1 rounded-lg shadow-sm border ${
              computedRisk > 75 ? 'bg-[#93000a] border-[#ffb4ab]/40 text-[#ffdad6]' :
              computedRisk > 45 ? 'bg-[#d88a00] border-[#ffb95f]/40 text-[#ffddb8]' :
              'bg-[#064e3b] border-[#34d399]/40 text-[#34d399]'
            }`}>
              <span className="font-['Inter'] text-[32px] font-bold leading-none">
                {computedRisk}
              </span>
              <span className="font-['JetBrains_Mono'] text-[13px] font-semibold opacity-80">
                /100
              </span>
            </div>
            <span className={`font-['JetBrains_Mono'] text-[10px] uppercase font-bold tracking-wider mt-1 ${severityTextColor}`}>
              {severityLabel}
            </span>
          </div>
        </div>

        {/* Breakdown Telemetry Segmented Progress Grid */}
        <div className="flex flex-col gap-2 bg-[#161b2a] p-3 rounded-lg border border-[#252a39]">
          <span className="font-['JetBrains_Mono'] text-[10px] text-[#bec8d2] font-bold uppercase tracking-wider">
            ATTRIBUTION BREAKDOWN
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Item 1 */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center text-[12px] mb-1 font-['Inter']">
                <span className="text-[#bec8d2]">Rainfall</span>
                <span className="font-['JetBrains_Mono'] text-[11px] font-bold text-[#dee2f6]">
                  {selectedZone.rainPct}%
                </span>
              </div>
              <div className="w-full h-2 bg-[#252a39] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0ea5e9] rounded-full transition-all duration-500"
                  style={{ width: `${selectedZone.rainPct}%` }}
                />
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center text-[12px] mb-1 font-['Inter']">
                <span className="text-[#bec8d2]">Drain Deficit</span>
                <span className="font-['JetBrains_Mono'] text-[11px] font-bold text-[#ffb4ab]">
                  {selectedZone.drainPct}%
                </span>
              </div>
              <div className="w-full h-2 bg-[#252a39] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#ffb4ab] rounded-full transition-all duration-500"
                  style={{ width: `${selectedZone.drainPct}%` }}
                />
              </div>
            </div>

            {/* Item 3 */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center text-[12px] mb-1 font-['Inter']">
                <span className="text-[#bec8d2]">Elevation Trap</span>
                <span className="font-['JetBrains_Mono'] text-[11px] font-bold text-[#ffb95f]">
                  {selectedZone.elevPct}%
                </span>
              </div>
              <div className="w-full h-2 bg-[#252a39] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#ffb95f] rounded-full transition-all duration-500"
                  style={{ width: `${selectedZone.elevPct}%` }}
                />
              </div>
            </div>

            {/* Item 4 */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center text-[12px] mb-1 font-['Inter']">
                <span className="text-[#bec8d2]">Road Vulnerability</span>
                <span className="font-['JetBrains_Mono'] text-[11px] font-bold text-[#89ceff]">
                  {selectedZone.roadPct}%
                </span>
              </div>
              <div className="w-full h-2 bg-[#252a39] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#89ceff] rounded-full transition-all duration-500"
                  style={{ width: `${selectedZone.roadPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Critical Indicators Triple Pill Group */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-[#252a39] p-3 rounded-lg flex flex-col items-center border border-[#3e4850]">
            <span className="font-['JetBrains_Mono'] text-[10px] text-[#bec8d2] uppercase font-bold tracking-wider">
              CASCADE RISK
            </span>
            <span className="font-['JetBrains_Mono'] text-[20px] font-bold text-[#ffb4ab] mt-0.5">
              {computedCascade}%
            </span>
            <span className="font-['JetBrains_Mono'] text-[11px] text-[#ffb4ab]">
              HIGH PROB
            </span>
          </div>

          <div className="bg-[#252a39] p-3 rounded-lg flex flex-col items-center border border-[#3e4850]">
            <span className="font-['JetBrains_Mono'] text-[10px] text-[#bec8d2] uppercase font-bold tracking-wider">
              POPULATION EXPOSED
            </span>
            <span className="font-['JetBrains_Mono'] text-[20px] font-bold text-[#ffb95f] mt-0.5">
              {selectedZone.pop}
            </span>
            <span className="font-['JetBrains_Mono'] text-[11px] text-[#bec8d2]">
              RESIDENTS
            </span>
          </div>

          <div className="bg-[#252a39] p-3 rounded-lg flex flex-col items-center border border-[#3e4850]">
            <span className="font-['JetBrains_Mono'] text-[10px] text-[#bec8d2] uppercase font-bold tracking-wider">
              ROAD CLOSURE PROB
            </span>
            <span className="font-['JetBrains_Mono'] text-[20px] font-bold text-[#ffb4ab] mt-0.5">
              {computedClosure}%
            </span>
            <span className="font-['JetBrains_Mono'] text-[11px] text-[#bec8d2]">
              TRAFFIC HALT
            </span>
          </div>
        </div>

        {/* Key Identified Drivers */}
        <div className="flex flex-col gap-1.5 bg-[#161b2a] p-3 rounded-lg border border-[#252a39]">
          <div className="flex items-start gap-2 flex-wrap">
            <span className="font-['JetBrains_Mono'] text-[10px] text-[#bec8d2] uppercase font-bold tracking-wider shrink-0 mt-0.5">
              PRIMARY ROOT CAUSE:
            </span>
            <span className="font-['Inter'] text-[13px] text-[#ffb4ab] font-semibold">
              {selectedZone.cause}
            </span>
          </div>
          <div className="flex items-start gap-2 flex-wrap">
            <span className="font-['JetBrains_Mono'] text-[10px] text-[#bec8d2] uppercase font-bold tracking-wider shrink-0 mt-0.5">
              CRITICAL ASSETS IN PERIL:
            </span>
            <span className="font-['Inter'] text-[13px] text-[#dee2f6]">
              {selectedZone.assets}
            </span>
          </div>
        </div>
      </section>

      {/* 4. Flood Consequence Graph (Cascade Consequence Chain) */}
      <section className="flex flex-col bg-[#1a1f2e] rounded-xl p-4 border border-[#252a39] shadow-md gap-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#89ceff]">account_tree</span>
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#bec8d2] font-bold uppercase tracking-wider">
                DETERMINISTIC DIRECTED ACYCLIC GRAPH
              </span>
            </div>
            <h2 className="font-['Inter'] text-[18px] font-semibold text-[#dee2f6]">
              Cascade Consequence Chain
            </h2>
          </div>
          <span className="font-['JetBrains_Mono'] text-[10px] bg-[#252a39] border border-[#3e4850] px-2 py-0.5 rounded text-[#89ceff] font-bold">
            APEX LEVERAGE POINT
          </span>
        </div>

        {/* Steps Flow */}
        <div className="flex flex-col gap-1.5 mt-1">
          {/* Step 1 */}
          <div className="flex items-center gap-3 p-3 bg-[#161b2a] rounded-lg border border-[#252a39]">
            <div className="w-8 h-8 rounded bg-[#0ea5e9]/20 border border-[#0ea5e9]/30 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#89ceff] text-[20px]">rainy</span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-['Inter'] text-[14px] font-semibold text-[#dee2f6]">
                  1. Extreme Precipitation
                </span>
                <span className="font-['JetBrains_Mono'] text-[11px] text-[#89ceff] font-bold">
                  {selectedZone.rainMm}
                </span>
              </div>
              <span className="font-['Inter'] text-[12px] text-[#bec8d2]">
                Atmospheric river front dumping into low-lying basin
              </span>
            </div>
          </div>

          <div className="flex justify-center -my-1 text-[#88929b]">
            <span className="material-symbols-outlined text-[16px]">south</span>
          </div>

          {/* Step 2 */}
          <div className="flex items-center gap-3 p-3 bg-[#161b2a] rounded-lg border border-[#252a39]">
            <div className="w-8 h-8 rounded bg-[#d88a00]/20 border border-[#d88a00]/30 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#ffb95f] text-[20px]">compare_arrows</span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-['Inter'] text-[14px] font-semibold text-[#dee2f6]">
                  2. Drainage Overload
                </span>
                <span className="font-['JetBrains_Mono'] text-[11px] text-[#ffb95f] font-bold">
                  140% Intake Cap
                </span>
              </div>
              <span className="font-['Inter'] text-[12px] text-[#bec8d2]">
                Culvert C-4 hydraulic head backwater pressure surge
              </span>
            </div>
          </div>

          <div className="flex justify-center -my-1 text-[#88929b]">
            <span className="material-symbols-outlined text-[16px]">south</span>
          </div>

          {/* Step 3 */}
          <div className="flex items-center gap-3 p-3 bg-[#161b2a] rounded-lg border border-[#252a39]">
            <div className="w-8 h-8 rounded bg-[#93000a]/20 border border-[#93000a]/30 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#ffb4ab] text-[20px]">traffic</span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-['Inter'] text-[14px] font-semibold text-[#dee2f6]">
                  3. Surface Inundation
                </span>
                <span className="font-['JetBrains_Mono'] text-[11px] text-[#ffb4ab] font-bold">
                  {computedClosure}% Probability
                </span>
              </div>
              <span className="font-['Inter'] text-[12px] text-[#bec8d2]">
                Submersion of 4th &amp; Riverside intersection
              </span>
            </div>
          </div>

          <div className="flex justify-center -my-1 text-[#ffb4ab]">
            <span className="material-symbols-outlined text-[16px]">south</span>
          </div>

          {/* Step 4: CRITICAL APEX NODE */}
          <div className="flex flex-col p-3.5 bg-[#303444] rounded-lg border-2 border-[#ffb4ab] shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#ffb4ab] animate-pulse">crisis_alert</span>
                <span className="font-['Inter'] text-[15px] font-bold text-[#dee2f6]">
                  CRITICAL NODE: Main Junction A
                </span>
              </div>
              <span className="font-['JetBrains_Mono'] text-[10px] bg-[#93000a] text-[#ffdad6] px-2 py-0.5 rounded font-bold border border-[#ffb4ab]/40">
                LEVERAGE 9.4 / 10
              </span>
            </div>
            <p className="font-['Inter'] text-[12px] text-[#bec8d2] mt-1.5 leading-relaxed">
              Apex hydraulic &amp; vehicular convergence intersection. Failure here paralyzes 6 distinct city districts and cuts off St. Jude Hospital.
            </p>
            <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
              <div className="flex items-center gap-1 font-['JetBrains_Mono'] text-[11px] text-[#89ceff]">
                <span className="material-symbols-outlined text-[14px]">psychology</span>
                <span>Intervention target #1</span>
              </div>
              <button
                onClick={onOpenNodeModal}
                className="bg-[#89ceff] text-[#00344d] hover:bg-[#c9e6ff] px-3 py-1 rounded font-['Inter'] text-[12px] font-semibold flex items-center gap-1 shadow transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">info</span>
                <span>Why this Node?</span>
              </button>
            </div>
          </div>

          <div className="flex justify-center -my-1 text-[#88929b]">
            <span className="material-symbols-outlined text-[16px]">south</span>
          </div>

          {/* Step 5 */}
          <div className="flex items-center gap-3 p-3 bg-[#161b2a] rounded-lg border border-[#252a39]">
            <div className="w-8 h-8 rounded bg-[#93000a]/20 border border-[#93000a]/30 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#ffb4ab] text-[20px]">emergency</span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-['Inter'] text-[14px] font-semibold text-[#dee2f6]">
                  5. Emergency Access Delay
                </span>
                <span className="font-['JetBrains_Mono'] text-[11px] text-[#ffb4ab] font-bold">
                  {isSimulated ? '+2 min (Safe)' : '+18 min ambulance lag'}
                </span>
              </div>
              <span className="font-['Inter'] text-[12px] text-[#bec8d2]">
                Complete severance of the trauma center express lane
              </span>
            </div>
          </div>

          <div className="flex justify-center -my-1 text-[#88929b]">
            <span className="material-symbols-outlined text-[16px]">south</span>
          </div>

          {/* Step 6 */}
          <div className="flex items-center gap-3 p-3 bg-[#161b2a] rounded-lg border border-[#252a39]">
            <div className="w-8 h-8 rounded bg-[#303444] border border-[#3e4850] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#bec8d2] text-[20px]">group_off</span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-['Inter'] text-[14px] font-semibold text-[#dee2f6]">
                  6. Severe Public Harm
                </span>
                <span className="font-['JetBrains_Mono'] text-[11px] text-[#bec8d2]">
                  {selectedZone.pop} Citizens
                </span>
              </div>
              <span className="font-['Inter'] text-[12px] text-[#bec8d2]">
                Direct property inundation + medical dispatch lockout
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Editable Resource & Constraint Console */}
      <section className="flex flex-col bg-[#1a1f2e] rounded-xl p-4 border border-[#252a39] shadow-md gap-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#89ceff]">local_shipping</span>
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#bec8d2] font-bold uppercase tracking-wider">
                EOC TACTICAL ASSETS INVENTORY
              </span>
            </div>
            <h2 className="font-['Inter'] text-[18px] font-semibold text-[#dee2f6]">
              Resource &amp; Constraint Console
            </h2>
          </div>
          <button
            onClick={onResetResources}
            className="bg-[#252a39] hover:bg-[#303444] text-[#dee2f6] px-2.5 py-1 rounded font-['JetBrains_Mono'] text-[11px] transition-colors border border-[#3e4850]"
          >
            RESET TO DEFAULT
          </button>
        </div>

        {/* Inviolable Constraint Callout */}
        <div className="bg-[#93000a]/20 border border-[#ffb4ab]/40 p-3 rounded-lg flex items-center gap-3">
          <span className="material-symbols-outlined text-[#ffb4ab] text-[24px] shrink-0 animate-pulse">lock</span>
          <div className="flex flex-col">
            <span className="font-['JetBrains_Mono'] text-[10px] text-[#ffb4ab] uppercase font-bold tracking-wider">
              INVIOLABLE OPERATIONAL CONSTRAINT
            </span>
            <span className="font-['Inter'] text-[13px] text-[#dee2f6] font-semibold">
              &quot;EMERGENCY CORRIDOR MUST REMAIN ACCESSIBLE (AMBULANCE ACCESS &lt; 5 MIN)&quot;
            </span>
          </div>
        </div>

        {/* Stepper Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Stepper 1: Mobile Pumps */}
          <div className="bg-[#161b2a] p-3 rounded-lg border border-[#252a39] flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <span className="font-['Inter'] text-[14px] font-semibold text-[#dee2f6]">
                Mobile Pumps
              </span>
              <span className="material-symbols-outlined text-[18px] text-[#89ceff]">water_drop</span>
            </div>
            <div className="flex items-center justify-between bg-[#303444] px-3 py-1 rounded-lg border border-[#3e4850]">
              <button
                onClick={() => {
                  if (resources.pumps > 0) {
                    onUpdateResources({ pumps: resources.pumps - 1 });
                    onNotify(`Pumps reduced to ${resources.pumps - 1}. Risk recalibrated.`);
                  }
                }}
                className="w-8 h-8 rounded bg-[#1a1f2e] hover:bg-[#0ea5e9] hover:text-[#00344d] flex items-center justify-center text-lg font-bold text-[#dee2f6] transition-colors select-none"
              >
                −
              </button>
              <div className="flex flex-col items-center">
                <span className="font-['JetBrains_Mono'] text-[20px] font-bold text-[#89ceff]">
                  {resources.pumps}
                </span>
                <span className="font-['JetBrains_Mono'] text-[11px] text-[#bec8d2]">
                  Units Ready
                </span>
              </div>
              <button
                onClick={() => {
                  if (resources.pumps < 6) {
                    onUpdateResources({ pumps: resources.pumps + 1 });
                    onNotify(`Pumps increased to ${resources.pumps + 1}. Hydraulic bypass reinforced.`);
                  }
                }}
                className="w-8 h-8 rounded bg-[#1a1f2e] hover:bg-[#0ea5e9] hover:text-[#00344d] flex items-center justify-center text-lg font-bold text-[#dee2f6] transition-colors select-none"
              >
                +
              </button>
            </div>
            <span className="font-['Inter'] text-[12px] text-[#bec8d2]">
              Discharge: 40 m³/s per unit
            </span>
          </div>

          {/* Stepper 2: Rescue Teams */}
          <div className="bg-[#161b2a] p-3 rounded-lg border border-[#252a39] flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <span className="font-['Inter'] text-[14px] font-semibold text-[#dee2f6]">
                Rescue Teams
              </span>
              <span className="material-symbols-outlined text-[18px] text-[#ffb95f]">groups</span>
            </div>
            <div className="flex items-center justify-between bg-[#303444] px-3 py-1 rounded-lg border border-[#3e4850]">
              <button
                onClick={() => {
                  if (resources.rescueTeams > 0) {
                    onUpdateResources({ rescueTeams: resources.rescueTeams - 1 });
                  }
                }}
                className="w-8 h-8 rounded bg-[#1a1f2e] hover:bg-[#ffb95f] hover:text-[#472a00] flex items-center justify-center text-lg font-bold text-[#dee2f6] transition-colors select-none"
              >
                −
              </button>
              <div className="flex flex-col items-center">
                <span className="font-['JetBrains_Mono'] text-[20px] font-bold text-[#ffb95f]">
                  {resources.rescueTeams}
                </span>
                <span className="font-['JetBrains_Mono'] text-[11px] text-[#bec8d2]">
                  Squads
                </span>
              </div>
              <button
                onClick={() => {
                  if (resources.rescueTeams < 8) {
                    onUpdateResources({ rescueTeams: resources.rescueTeams + 1 });
                  }
                }}
                className="w-8 h-8 rounded bg-[#1a1f2e] hover:bg-[#ffb95f] hover:text-[#472a00] flex items-center justify-center text-lg font-bold text-[#dee2f6] transition-colors select-none"
              >
                +
              </button>
            </div>
            <span className="font-['Inter'] text-[12px] text-[#bec8d2]">
              Equipped with zodiac boats
            </span>
          </div>

          {/* Stepper 3: Barricades */}
          <div className="bg-[#161b2a] p-3 rounded-lg border border-[#252a39] flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <span className="font-['Inter'] text-[14px] font-semibold text-[#dee2f6]">
                Barricades
              </span>
              <span className="material-symbols-outlined text-[18px] text-[#ffb4ab]">fence</span>
            </div>
            <div className="flex items-center justify-between bg-[#303444] px-3 py-1 rounded-lg border border-[#3e4850]">
              <button
                onClick={() => {
                  if (resources.barricades > 0) {
                    onUpdateResources({ barricades: resources.barricades - 1 });
                  }
                }}
                className="w-8 h-8 rounded bg-[#1a1f2e] hover:bg-[#ffb4ab] hover:text-[#68000a] flex items-center justify-center text-lg font-bold text-[#dee2f6] transition-colors select-none"
              >
                −
              </button>
              <div className="flex flex-col items-center">
                <span className="font-['JetBrains_Mono'] text-[20px] font-bold text-[#ffb4ab]">
                  {resources.barricades}
                </span>
                <span className="font-['JetBrains_Mono'] text-[11px] text-[#bec8d2]">
                  Sets (100m ea)
                </span>
              </div>
              <button
                onClick={() => {
                  if (resources.barricades < 8) {
                    onUpdateResources({ barricades: resources.barricades + 1 });
                  }
                }}
                className="w-8 h-8 rounded bg-[#1a1f2e] hover:bg-[#ffb4ab] hover:text-[#68000a] flex items-center justify-center text-lg font-bold text-[#dee2f6] transition-colors select-none"
              >
                +
              </button>
            </div>
            <span className="font-['Inter'] text-[12px] text-[#bec8d2]">
              Quick-deploy inflatable dam
            </span>
          </div>
        </div>
      </section>

      {/* 6. AI Intervention Advisor (ClimaForge Advisory Matrix) */}
      <section className="flex flex-col bg-[#1a1f2e] rounded-xl p-4 border border-[#252a39] shadow-md gap-4 relative overflow-hidden">
        {/* Left vertical accent bar */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#0ea5e9]" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#89ceff]">smart_toy</span>
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#89ceff] uppercase font-bold tracking-wider">
                CLIMAFORGE ADVISORY MATRIX
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <h2 className="font-['Inter'] text-[18px] font-semibold text-[#dee2f6]">
                Optimal Intervention Plan
              </h2>
              <span className={`font-['JetBrains_Mono'] text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                engineMode === 'NUGEN' ? 'bg-[#0ea5e9] text-[#003751]' : 'bg-[#d88a00] text-[#4a2c00]'
              }`}>
                {engineMode === 'NUGEN' ? 'LIVE NUGEN' : engineMode === 'GEMINI' ? 'GEMINI 3.8 FLASH' : 'FALLBACK'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-['JetBrains_Mono'] text-[10px] bg-[#93000a] text-[#ffdad6] px-2 py-1 rounded uppercase font-bold border border-[#ffb4ab]/30">
              PRIORITY: P0 (IMMEDIATE)
            </span>
            <span className="font-['JetBrains_Mono'] text-[11px] text-[#89ceff] font-bold">
              CONFIDENCE: 94.2%
            </span>
          </div>
        </div>

        {/* Recommended Action Directive Card */}
        <div className="bg-[#090e1c] p-4 rounded-lg border border-[#252a39] flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="font-['JetBrains_Mono'] text-[10px] text-[#89ceff] uppercase font-bold tracking-wider">
              TACTICAL DIRECTIVE:
            </span>
            <span className="font-['JetBrains_Mono'] text-[11px] text-[#bec8d2]">
              EXECUTION WINDOW: &lt; 14 MIN
            </span>
          </div>
          <p className="font-['Inter'] text-[15px] text-[#dee2f6] font-semibold leading-snug">
            {directiveText}
          </p>
          <p className="font-['Inter'] text-[13px] text-[#bec8d2] leading-relaxed">
            <span className="text-[#89ceff] font-semibold">Deterministic Rationale:</span> {rationaleText}
          </p>
        </div>

        {/* Cascade Break Target & Expected Quantified Impact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-[#161b2a] p-3 rounded-lg border border-[#252a39] flex flex-col">
            <span className="font-['JetBrains_Mono'] text-[10px] text-[#bec8d2] uppercase font-bold tracking-wider">
              TARGET CASCADE TO SEVER
            </span>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#ffb4ab]">link_off</span>
              <span className="font-['Inter'] text-[13px] font-semibold text-[#ffb4ab]">
                Road closure → Traffic Disruption → Emergency Delay
              </span>
            </div>
            <span className="font-['JetBrains_Mono'] text-[11px] text-[#88929b] mt-1">
              Breaks domino progression at junction nexus
            </span>
          </div>

          <div className="bg-[#161b2a] p-3 rounded-lg border border-[#252a39] flex flex-col">
            <span className="font-['JetBrains_Mono'] text-[10px] text-[#bec8d2] uppercase font-bold tracking-wider">
              PROJECTED MITIGATION PAYOFF
            </span>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#89ceff]">check_circle</span>
              <span className={`font-['Inter'] text-[13px] font-semibold ${payoffClass}`}>
                {payoffText}
              </span>
            </div>
            <span className="font-['JetBrains_Mono'] text-[11px] text-[#88929b] mt-1">
              Inviolable corridor constraint satisfied
            </span>
          </div>
        </div>

        {/* Action Button Suite */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1">
          <button
            onClick={onGeneratePlan}
            className="h-10 bg-[#89ceff] hover:bg-[#c9e6ff] text-[#00344d] font-['Inter'] text-[13px] font-bold rounded-lg flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span>Generate Plan</span>
          </button>

          <button
            onClick={onOpenNodeModal}
            className="h-10 bg-[#252a39] hover:bg-[#303444] text-[#dee2f6] font-['Inter'] text-[13px] font-medium rounded-lg flex items-center justify-center gap-2 border border-[#3e4850] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-[#89ceff]">help</span>
            <span>Why this Node?</span>
          </button>

          <button
            onClick={onOpenActionModal}
            className="h-10 bg-[#252a39] hover:bg-[#303444] text-[#dee2f6] font-['Inter'] text-[13px] font-medium rounded-lg flex items-center justify-center gap-2 border border-[#3e4850] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-[#ffb95f]">psychology_alt</span>
            <span>Why this Action?</span>
          </button>

          <button
            onClick={onToggleSimulate}
            className={`h-10 font-['Inter'] text-[13px] font-bold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer border ${
              isSimulated
                ? 'bg-[#0ea5e9] text-[#00344d] border-[#89ceff] shadow-lg shadow-[#0ea5e9]/30'
                : 'bg-[#303444] hover:bg-[#0ea5e9] hover:text-[#00344d] text-[#89ceff] border-[#3e4850]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">model_training</span>
            <span>{isSimulated ? 'Exit Simulation' : 'Simulate (What-If)'}</span>
          </button>
        </div>
      </section>
    </div>
  );
};
