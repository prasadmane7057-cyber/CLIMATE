import React, { useState } from 'react';
import { SCENARIO_COMPARISONS } from '../data/initialData';
import { ScenarioMatrix } from '../types';

interface CompareScreenProps {
  onDeployScenario: (scenario: ScenarioMatrix) => void;
  onNotify: (msg: string) => void;
}

export const CompareScreen: React.FC<CompareScreenProps> = ({
  onDeployScenario,
  onNotify
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('s3');

  const activeScenario = SCENARIO_COMPARISONS.find(s => s.id === selectedScenarioId) || SCENARIO_COMPARISONS[3];

  return (
    <div className="flex flex-col gap-4 p-4 max-w-5xl mx-auto w-full">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#1a1f2e] p-4 rounded-xl border border-[#252a39] shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#89ceff] text-[20px]">compare_arrows</span>
            <span className="font-['JetBrains_Mono'] text-[10px] text-[#89ceff] uppercase font-bold tracking-wider">
              STRATEGIC TRADE-OFF ARBITRAGE
            </span>
          </div>
          <h1 className="font-['Inter'] text-[20px] font-bold text-[#dee2f6] mt-0.5">
            Tactical Scenario Comparison Matrix
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onDeployScenario(activeScenario)}
            className="bg-[#89ceff] hover:bg-[#c9e6ff] text-[#00344d] font-['Inter'] text-[12px] font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all shadow"
          >
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>Deploy Selected ({activeScenario.title.split(':')[0]})</span>
          </button>
        </div>
      </div>

      {/* 4-Scenario Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {SCENARIO_COMPARISONS.map(sc => {
          const isSelected = sc.id === selectedScenarioId;
          const meetsHospitalConstraint = sc.hospitalAccessTime <= 5.0;

          return (
            <div
              key={sc.id}
              onClick={() => {
                setSelectedScenarioId(sc.id);
                onNotify(`Selected comparison view: ${sc.title}`);
              }}
              className={`flex flex-col justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-[#303444] border-[#89ceff] ring-1 ring-[#89ceff]/50 shadow-lg'
                  : 'bg-[#1a1f2e] border-[#252a39] hover:bg-[#252a39]'
              }`}
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className={`font-['JetBrains_Mono'] text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${sc.tagColor}`}>
                    {sc.tag}
                  </span>
                  <span className="font-['JetBrains_Mono'] text-[11px] text-[#bec8d2]">
                    Score: <strong className={sc.feasibilityScore > 70 ? 'text-[#34d399]' : 'text-[#ffb4ab]'}>{sc.feasibilityScore}/100</strong>
                  </span>
                </div>

                <h3 className="font-['Inter'] text-[14px] font-bold text-[#dee2f6] leading-snug">
                  {sc.title}
                </h3>

                <p className="font-['Inter'] text-[12px] text-[#bec8d2] line-clamp-3">
                  {sc.summary}
                </p>
              </div>

              {/* Key Indicators Mini-Table */}
              <div className="flex flex-col gap-1.5 mt-3 pt-2.5 border-t border-[#252a39] text-[11px] font-mono">
                <div className="flex justify-between items-center">
                  <span className="text-[#88929b]">Trauma Lag:</span>
                  <span className={`font-bold ${meetsHospitalConstraint ? 'text-[#34d399]' : 'text-[#ffb4ab]'}`}>
                    +{sc.hospitalAccessTime} min {meetsHospitalConstraint ? '✓' : '⚠️'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#88929b]">Asset Loss:</span>
                  <span className="text-[#ffb95f] font-bold">${sc.economicDamage}M</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#88929b]">Population:</span>
                  <span className="text-[#dee2f6]">{sc.populationExposed.toLocaleString()} exposed</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deep Dive Comparison Pane */}
      <div className="bg-[#1a1f2e] p-4 rounded-xl border border-[#252a39] shadow-md flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-[#252a39] pb-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#89ceff] text-[18px]">analytics</span>
            <span className="font-['Inter'] text-[15px] font-bold text-[#dee2f6]">
              Side-by-Side Quantitative Matrix
            </span>
          </div>
          <span className="font-['JetBrains_Mono'] text-[11px] text-[#bec8d2]">
            Constraint: Hospital Corridor Delay &lt; 5.0 Min
          </span>
        </div>

        {/* Comparison Bars */}
        <div className="space-y-4">
          {/* Metric 1: Ambulance Response Delay */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-['Inter'] text-[#dee2f6] font-medium">
                Ambulance Lag to St. Jude Trauma Hub (Inviolable Target: &lt; 5 min)
              </span>
              <span className="font-mono text-[#88929b]">Lower is better</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              {SCENARIO_COMPARISONS.map(sc => (
                <div key={sc.id} className="flex flex-col bg-[#161b2a] p-2 rounded border border-[#252a39]">
                  <div className="flex justify-between text-[11px] mb-1 font-mono">
                    <span className="text-[#bec8d2] truncate">{sc.title.split(':')[0]}</span>
                    <span className={`font-bold ${sc.hospitalAccessTime <= 5 ? 'text-[#34d399]' : 'text-[#ffb4ab]'}`}>
                      {sc.hospitalAccessTime}m
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#252a39] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${sc.hospitalAccessTime <= 5 ? 'bg-[#10b981]' : 'bg-[#ffb4ab]'}`}
                      style={{ width: `${Math.min(100, (sc.hospitalAccessTime / 35) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Metric 2: Estimated Economic Damage */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-['Inter'] text-[#dee2f6] font-medium">
                Estimated Economic Damage ($ Millions)
              </span>
              <span className="font-mono text-[#88929b]">Lower is better</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              {SCENARIO_COMPARISONS.map(sc => (
                <div key={sc.id} className="flex flex-col bg-[#161b2a] p-2 rounded border border-[#252a39]">
                  <div className="flex justify-between text-[11px] mb-1 font-mono">
                    <span className="text-[#bec8d2] truncate">{sc.title.split(':')[0]}</span>
                    <span className="text-[#ffb95f] font-bold">${sc.economicDamage}M</span>
                  </div>
                  <div className="w-full h-2 bg-[#252a39] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#ffb95f] rounded-full"
                      style={{ width: `${(sc.economicDamage / 45) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Metric 3: Inundation Area */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-['Inter'] text-[#dee2f6] font-medium">
                Inundation Area Footprint (Square Kilometers)
              </span>
              <span className="font-mono text-[#88929b]">Lower is better</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              {SCENARIO_COMPARISONS.map(sc => (
                <div key={sc.id} className="flex flex-col bg-[#161b2a] p-2 rounded border border-[#252a39]">
                  <div className="flex justify-between text-[11px] mb-1 font-mono">
                    <span className="text-[#bec8d2] truncate">{sc.title.split(':')[0]}</span>
                    <span className="text-[#89ceff] font-bold">{sc.inundationArea} km²</span>
                  </div>
                  <div className="w-full h-2 bg-[#252a39] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#0ea5e9] rounded-full"
                      style={{ width: `${(sc.inundationArea / 9.0) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Strategy Operational Synthesis */}
        <div className="bg-[#090e1c] p-4 rounded-lg border border-[#252a39] flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-['JetBrains_Mono'] text-[10px] text-[#89ceff] uppercase font-bold tracking-wider">
              OPERATIONAL SYNTHESIS: {activeScenario.title}
            </span>
            <span className={`font-['JetBrains_Mono'] text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
              activeScenario.apexSecured ? 'bg-[#064e3b] text-[#34d399]' : 'bg-[#93000a] text-[#ffdad6]'
            }`}>
              {activeScenario.apexSecured ? 'APEX NODE PROTECTED' : 'APEX COMPROMISED'}
            </span>
          </div>
          <p className="font-['Inter'] text-[13px] text-[#dee2f6] leading-relaxed">
            {activeScenario.summary}
          </p>
          <div className="flex items-center justify-between pt-2 border-t border-[#1e2638] text-xs">
            <span className="text-[#88929b]">
              Required Resource Commitment: <strong>{activeScenario.pumps} Mobile Pumps</strong>, <strong>{activeScenario.barricades} Barricade Sets</strong>
            </span>
            <button
              onClick={() => onDeployScenario(activeScenario)}
              className="bg-[#89ceff] text-[#00344d] font-bold px-3 py-1 rounded transition-colors hover:bg-[#c9e6ff]"
            >
              Authorize &amp; Execute
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
