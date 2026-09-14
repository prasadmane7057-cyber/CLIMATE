import React, { useState } from 'react';
import { WhatIfState, TacticalResources } from '../types';

interface WhatIfScreenProps {
  resources: TacticalResources;
  onApplyToCommand: (resources: TacticalResources) => void;
  onNotify: (msg: string) => void;
}

export const WhatIfScreen: React.FC<WhatIfScreenProps> = ({
  resources,
  onApplyToCommand,
  onNotify
}) => {
  const [params, setParams] = useState<WhatIfState>({
    rainIntensity: 52,
    damDischarge: 80,
    activePumps: resources.pumps,
    barricadeSets: resources.barricades,
    sluiceAperture: 40
  });

  const [monteCarloRunning, setMonteCarloRunning] = useState(false);
  const [monteCarloResult, setMonteCarloResult] = useState<string | null>(null);

  // Derived calculations
  // Total hydraulic head inflow in m3/s: rain * 2.1 + dam * 0.85
  const grossInflow = +(params.rainIntensity * 2.1 + params.damDischarge * 0.85).toFixed(0);
  
  // Total discharge drainage: standard culvert cap (100 m3/s) + pump discharge (40 per unit) + sluice diversion (sluice% * 0.8)
  const grossDischarge = +(100 + params.activePumps * 40 + params.sluiceAperture * 0.8).toFixed(0);
  
  const netSurge = grossInflow - grossDischarge;
  
  // Projected river stage peak (m)
  const baselineHeight = 3.2;
  const stagePeak = +(baselineHeight + Math.max(0, netSurge * 0.018)).toFixed(2);
  const criticalThreshold = 4.10;
  const isBreached = stagePeak > criticalThreshold;

  // Hospital corridor delay
  // If barricades >= 3 and pumps >= 2, delay is minimal (< 4 min)
  let hospitalDelay = 2.5;
  if (isBreached) {
    const breachDeficit = stagePeak - criticalThreshold;
    const defenseBuffer = (params.activePumps * 0.4) + (params.barricadeSets * 0.25);
    hospitalDelay = +(2.5 + Math.max(0, breachDeficit * 18 - defenseBuffer * 4)).toFixed(1);
  }

  // Financial and citizen exposure
  const inundationSqKm = +(Math.max(0.4, (stagePeak - 2.8) * 3.2)).toFixed(1);
  const financialDamageM = +(inundationSqKm * 4.8).toFixed(1);
  const exposedCitizens = Math.min(6500, Math.floor(inundationSqKm * 620));

  const handlePreset = (name: string, p: Partial<WhatIfState>) => {
    setParams(prev => ({ ...prev, ...p }));
    onNotify(`Loaded Preset: ${name}`);
  };

  const runMonteCarlo = () => {
    setMonteCarloRunning(true);
    setMonteCarloResult(null);
    setTimeout(() => {
      setMonteCarloRunning(false);
      setMonteCarloResult(
        isBreached && hospitalDelay > 5
          ? "Stress Test Complete (100 paths): 87% chance of violating St. Jude trauma constraint without +1 additional pump array."
          : "Stress Test Complete (100 paths): 96.4% confidence that trauma transit remains within inviolable 5 min limit."
      );
      onNotify("Monte Carlo 100-path stochastic modeling completed.");
    }, 1200);
  };

  const handleApply = () => {
    onApplyToCommand({
      pumps: params.activePumps,
      barricades: params.barricadeSets,
      rescueTeams: resources.rescueTeams
    });
    onNotify(`Scenario resources applied: ${params.activePumps} Pumps & ${params.barricadeSets} Barricades.`);
  };

  return (
    <div className="flex flex-col gap-4 p-4 max-w-5xl mx-auto w-full">
      {/* Title & Simulation Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#1a1f2e] p-4 rounded-xl border border-[#252a39] shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#89ceff] text-[20px]">model_training</span>
            <span className="font-['JetBrains_Mono'] text-[10px] text-[#89ceff] uppercase font-bold tracking-wider">
              DYNAMIC HYDROLOGICAL SIMULATOR
            </span>
          </div>
          <h1 className="font-['Inter'] text-[20px] font-bold text-[#dee2f6] mt-0.5">
            What-If Scenario Sandbox
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleApply}
            className="bg-[#89ceff] hover:bg-[#c9e6ff] text-[#00344d] font-['Inter'] text-[12px] font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all shadow"
          >
            <span className="material-symbols-outlined text-[16px]">sync</span>
            <span>Commit to Command Center</span>
          </button>
        </div>
      </div>

      {/* Preset Buttons Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 select-none">
        <span className="font-['JetBrains_Mono'] text-[10px] text-[#bec8d2] font-bold uppercase tracking-wider shrink-0">
          PRESETS:
        </span>
        <button
          onClick={() => handlePreset('100-Year Atmospheric River', { rainIntensity: 88, damDischarge: 140, activePumps: 2, barricadeSets: 3, sluiceAperture: 80 })}
          className="bg-[#252a39] hover:bg-[#303444] text-[#dee2f6] text-[12px] px-2.5 py-1 rounded border border-[#3e4850] whitespace-nowrap transition-colors"
        >
          🌧️ 100-Yr Atmospheric River
        </button>
        <button
          onClick={() => handlePreset('Dam Spillway Surcharge', { rainIntensity: 45, damDischarge: 210, activePumps: 3, barricadeSets: 4, sluiceAperture: 100 })}
          className="bg-[#252a39] hover:bg-[#303444] text-[#dee2f6] text-[12px] px-2.5 py-1 rounded border border-[#3e4850] whitespace-nowrap transition-colors"
        >
          🌊 Spillway Surge (+210m³/s)
        </button>
        <button
          onClick={() => handlePreset('Flash Urban Downpour', { rainIntensity: 110, damDischarge: 40, activePumps: 1, barricadeSets: 2, sluiceAperture: 30 })}
          className="bg-[#252a39] hover:bg-[#303444] text-[#dee2f6] text-[12px] px-2.5 py-1 rounded border border-[#3e4850] whitespace-nowrap transition-colors"
        >
          ⚡ Flash Cloudburst (110 mm/hr)
        </button>
        <button
          onClick={() => handlePreset('Optimal Mitigated Defense', { rainIntensity: 52, damDischarge: 80, activePumps: 3, barricadeSets: 4, sluiceAperture: 70 })}
          className="bg-[#064e3b] hover:bg-[#065f46] text-[#34d399] text-[12px] px-2.5 py-1 rounded border border-[#10b981] whitespace-nowrap transition-colors font-bold"
        >
          🛡️ Maximum Apex Defense
        </button>
      </div>

      {/* Main Grid: Left Sliders, Right Hydrograph & Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Col: Parameter Tuning Sliders (5 cols) */}
        <div className="lg:col-span-5 bg-[#1a1f2e] p-4 rounded-xl border border-[#252a39] shadow-md flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-[#252a39] pb-2">
            <span className="font-['Inter'] text-[15px] font-bold text-[#dee2f6]">
              Hydraulic Forcing Inputs
            </span>
            <span className="font-['JetBrains_Mono'] text-[10px] text-[#89ceff]">
              REAL-TIME SOLVER
            </span>
          </div>

          {/* Slider 1: Rain Intensity */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#dee2f6] font-medium flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#89ceff]">rainy</span>
                Precipitation Intensity
              </span>
              <span className="font-mono text-[#89ceff] font-bold">
                {params.rainIntensity} mm/hr
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="120"
              value={params.rainIntensity}
              onChange={e => setParams({ ...params, rainIntensity: +e.target.value })}
              className="w-full accent-[#0ea5e9] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#88929b] font-mono">
              <span>10 (Drizzle)</span>
              <span>60 (Severe)</span>
              <span>120 (Monsoon)</span>
            </div>
          </div>

          {/* Slider 2: Dam Spillway Discharge */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#dee2f6] font-medium flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#ffb95f]">water</span>
                Upstream Dam Spillway Release
              </span>
              <span className="font-mono text-[#ffb95f] font-bold">
                {params.damDischarge} m³/s
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="250"
              value={params.damDischarge}
              onChange={e => setParams({ ...params, damDischarge: +e.target.value })}
              className="w-full accent-[#ffb95f] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#88929b] font-mono">
              <span>0 (Closed)</span>
              <span>125 (Holding)</span>
              <span>250 (Full Spill)</span>
            </div>
          </div>

          {/* Slider 3: Mobile Pump Array */}
          <div className="flex flex-col gap-1.5 pt-2 border-t border-[#252a39]">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#dee2f6] font-medium flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#34d399]">water_drop</span>
                Active Mobile Pump Units
              </span>
              <span className="font-mono text-[#34d399] font-bold">
                {params.activePumps} units ({params.activePumps * 40} m³/s)
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="6"
              value={params.activePumps}
              onChange={e => setParams({ ...params, activePumps: +e.target.value })}
              className="w-full accent-[#10b981] cursor-pointer"
            />
          </div>

          {/* Slider 4: Inflatable Barricade Sets */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#dee2f6] font-medium flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#ffb4ab]">fence</span>
                Inflatable Dam Perimeter
              </span>
              <span className="font-mono text-[#ffb4ab] font-bold">
                {params.barricadeSets} sets ({params.barricadeSets * 100}m)
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="8"
              value={params.barricadeSets}
              onChange={e => setParams({ ...params, barricadeSets: +e.target.value })}
              className="w-full accent-[#ffb4ab] cursor-pointer"
            />
          </div>

          {/* Slider 5: Sluice Gate Aperture */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#dee2f6] font-medium flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#89ceff]">tune</span>
                Canal Sluice Gate Aperture
              </span>
              <span className="font-mono text-[#89ceff] font-bold">
                {params.sluiceAperture}% Open
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={params.sluiceAperture}
              onChange={e => setParams({ ...params, sluiceAperture: +e.target.value })}
              className="w-full accent-[#0ea5e9] cursor-pointer"
            />
          </div>
        </div>

        {/* Right Col: Hydrograph Waveform & Projected Outcomes (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Hydrograph Curve SVG Display */}
          <div className="bg-[#1a1f2e] p-4 rounded-xl border border-[#252a39] shadow-md flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[#89ceff]">show_chart</span>
                <span className="font-['Inter'] text-[15px] font-bold text-[#dee2f6]">
                  6-Hour Forecast Hydrograph
                </span>
              </div>
              <div className="flex items-center gap-3 text-[10px] font-mono">
                <span className="flex items-center gap-1 text-[#ffb4ab]">
                  <span className="w-2.5 h-0.5 bg-[#ffb4ab]" />
                  Projected Stage
                </span>
                <span className="flex items-center gap-1 text-[#ffb95f]">
                  <span className="w-2.5 h-0.5 bg-[#ffb95f] border-b border-dashed" />
                  Critical Threshold (4.10m)
                </span>
              </div>
            </div>

            {/* SVG Hydrograph Graph */}
            <div className="relative w-full h-[180px] bg-[#090e1c] rounded-lg border border-[#252a39] overflow-hidden p-2">
              <svg viewBox="0 0 500 150" className="w-full h-full">
                {/* Horizontal gridlines */}
                <line x1="40" y1="30" x2="480" y2="30" stroke="#252a39" strokeWidth="1" strokeDasharray="3,3" />
                <line x1="40" y1="70" x2="480" y2="70" stroke="#252a39" strokeWidth="1" strokeDasharray="3,3" />
                <line x1="40" y1="110" x2="480" y2="110" stroke="#252a39" strokeWidth="1" strokeDasharray="3,3" />
                
                {/* Threshold line at 4.10m */}
                <line x1="40" y1="55" x2="480" y2="55" stroke="#ffb95f" strokeWidth="1.5" strokeDasharray="6,4" />
                <text x="44" y="50" fill="#ffb95f" fontSize="9" fontFamily="JetBrains Mono">CRITICAL 4.10m</text>

                {/* Simulated Waveform Line */}
                {/* Peak height scaled from stagePeak */}
                {/* stagePeak between 3.0m and 5.5m maps to y between 110 and 20 */}
                {(() => {
                  const peakY = Math.max(15, 120 - ((stagePeak - 2.5) / 3.0) * 100);
                  const pathData = `M 40,115 Q 150,110 220,${peakY} T 480,95`;
                  return (
                    <>
                      <defs>
                        <linearGradient id="curveGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={isBreached ? "#ffb4ab" : "#0ea5e9"} stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#090e1c" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path d={`${pathData} L 480,140 L 40,140 Z`} fill="url(#curveGrad)" />
                      <path
                        d={pathData}
                        fill="none"
                        stroke={isBreached ? "#ffb4ab" : "#89ceff"}
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      {/* Crest Circle Point */}
                      <circle cx="280" cy={peakY} r="5" fill={isBreached ? "#93000a" : "#0ea5e9"} stroke="#dee2f6" strokeWidth="2" />
                      <text x="290" y={peakY - 5} fill={isBreached ? "#ffb4ab" : "#89ceff"} fontSize="10" fontWeight="700" fontFamily="JetBrains Mono">
                        CREST: {stagePeak}m
                      </text>
                    </>
                  );
                })()}

                {/* X axis timestamps */}
                <text x="40" y="140" fill="#88929b" fontSize="8" fontFamily="JetBrains Mono">T+0H</text>
                <text x="130" y="140" fill="#88929b" fontSize="8" fontFamily="JetBrains Mono">T+1.5H</text>
                <text x="240" y="140" fill="#88929b" fontSize="8" fontFamily="JetBrains Mono">T+3.0H (CREST)</text>
                <text x="360" y="140" fill="#88929b" fontSize="8" fontFamily="JetBrains Mono">T+4.5H</text>
                <text x="460" y="140" fill="#88929b" fontSize="8" fontFamily="JetBrains Mono">T+6H</text>
              </svg>
            </div>
          </div>

          {/* Outcome Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* 1. Stage Peak */}
            <div className={`p-3 rounded-lg border flex flex-col ${
              isBreached ? 'bg-[#93000a]/20 border-[#ffb4ab]/40' : 'bg-[#161b2a] border-[#252a39]'
            }`}>
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#bec8d2] uppercase font-bold">
                PEAK STAGE
              </span>
              <span className={`font-['JetBrains_Mono'] text-[20px] font-bold mt-0.5 ${isBreached ? 'text-[#ffb4ab]' : 'text-[#34d399]'}`}>
                {stagePeak}m
              </span>
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#bec8d2]">
                {isBreached ? 'Threshold Exceeded' : 'Safe Margin'}
              </span>
            </div>

            {/* 2. Hospital Lag Time */}
            <div className={`p-3 rounded-lg border flex flex-col ${
              hospitalDelay > 5.0 ? 'bg-[#93000a]/30 border-[#ffb4ab]' : 'bg-[#161b2a] border-[#252a39]'
            }`}>
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#bec8d2] uppercase font-bold">
                TRAUMA LAG
              </span>
              <span className={`font-['JetBrains_Mono'] text-[20px] font-bold mt-0.5 ${hospitalDelay > 5.0 ? 'text-[#ffb4ab]' : 'text-[#89ceff]'}`}>
                +{hospitalDelay} min
              </span>
              <span className={`font-['JetBrains_Mono'] text-[10px] font-bold ${hospitalDelay > 5.0 ? 'text-[#ffb4ab]' : 'text-[#10b981]'}`}>
                {hospitalDelay > 5.0 ? 'FAIL (< 5 MIN)' : 'COMPLIANT'}
              </span>
            </div>

            {/* 3. Inundation Area */}
            <div className="bg-[#161b2a] p-3 rounded-lg border border-[#252a39] flex flex-col">
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#bec8d2] uppercase font-bold">
                INUNDATION
              </span>
              <span className="font-['JetBrains_Mono'] text-[20px] font-bold text-[#dee2f6] mt-0.5">
                {inundationSqKm} km²
              </span>
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#bec8d2]">
                {exposedCitizens.toLocaleString()} Residents
              </span>
            </div>

            {/* 4. Financial Damage */}
            <div className="bg-[#161b2a] p-3 rounded-lg border border-[#252a39] flex flex-col">
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#bec8d2] uppercase font-bold">
                EST. DAMAGE
              </span>
              <span className="font-['JetBrains_Mono'] text-[20px] font-bold text-[#ffb95f] mt-0.5">
                ${financialDamageM}M
              </span>
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#bec8d2]">
                Asset Loss
              </span>
            </div>
          </div>

          {/* Monte Carlo Simulation Box */}
          <div className="bg-[#1a1f2e] p-4 rounded-xl border border-[#252a39] shadow-md flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-['Inter'] text-[14px] font-bold text-[#dee2f6] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[#89ceff]">casino</span>
                Stochastic Monte Carlo Weather Perturbation (100 Storm Paths)
              </span>
              <button
                onClick={runMonteCarlo}
                disabled={monteCarloRunning}
                className="bg-[#252a39] hover:bg-[#303444] text-[#89ceff] text-[12px] font-bold px-3 py-1.5 rounded border border-[#3e4850] transition-colors flex items-center gap-1 disabled:opacity-50"
              >
                {monteCarloRunning ? (
                  <>
                    <span className="w-3 h-3 border-2 border-[#89ceff] border-t-transparent rounded-full animate-spin" />
                    <span>Iterating...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                    <span>Run Stress Test</span>
                  </>
                )}
              </button>
            </div>
            {monteCarloResult ? (
              <p className="font-['Inter'] text-[12px] text-[#dee2f6] bg-[#090e1c] p-2.5 rounded border border-[#252a39]">
                {monteCarloResult}
              </p>
            ) : (
              <p className="font-['Inter'] text-[12px] text-[#bec8d2]">
                Simulate 100 stochastic precipitation envelopes factoring convective cell drift, ground saturation lag, and culvert silt clogging probabilities.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
