import React from 'react';
import { ZoneData } from '../types';

interface TacticalMapProps {
  zone: ZoneData;
  pumps: number;
  barricades: number;
  isSimulated: boolean;
  onOpenApexNodeModal: () => void;
  onNotify: (msg: string) => void;
}

export const TacticalMap: React.FC<TacticalMapProps> = ({
  zone,
  pumps,
  barricades,
  isSimulated,
  onOpenApexNodeModal,
  onNotify
}) => {
  // Compute dynamic barrier deficit
  const totalDefense = pumps + barricades;
  const barrierDeficit = Math.max(0, 5 - totalDefense);

  // Compute if hospital corridor is intact
  const hospitalRouteSecure = isSimulated || (pumps >= 2 && barricades >= 2);

  // Dynamic river stage calculation
  let currentStage = zone.riverStageNum;
  if (isSimulated) {
    currentStage = +(currentStage * 0.72).toFixed(2);
  } else if (pumps > 2) {
    currentStage = +(currentStage - (pumps - 2) * 0.25).toFixed(2);
  } else if (pumps < 2) {
    currentStage = +(currentStage + (2 - pumps) * 0.35).toFixed(2);
  }

  // Calculate inundation polygon coordinates based on zone and mitigation
  let inundationPoints = "230,220 380,210 440,330 330,370 240,320";
  let inundationOpacity = isSimulated ? 0.25 : 0.85;

  if (zone.id === 'B') {
    inundationPoints = "180,100 320,90 350,180 210,190";
    inundationOpacity = 0.65;
  } else if (zone.id === 'C') {
    inundationPoints = "490,260 620,240 680,340 520,360";
    inundationOpacity = 0.55;
  } else if (zone.id === 'D') {
    inundationPoints = "60,60 120,50 150,120 70,130";
    inundationOpacity = 0.2;
  }

  return (
    <section className="flex flex-col bg-[#161b2a] rounded-xl overflow-hidden border border-[#252a39] shadow-md">
      {/* Header bar */}
      <div className="px-3 py-2 bg-[#1a1f2e] border-b border-[#252a39] flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-[#89ceff]">map</span>
          <span className="font-['Inter'] text-[15px] font-semibold text-[#dee2f6]">
            Tactical Hydrological Grid
          </span>
          <span className="font-['JetBrains_Mono'] text-[10px] bg-[#303444] border border-[#3e4850] px-2 py-0.5 rounded text-[#bec8d2]">
            {zone.name} HYDROGRAPH
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-['JetBrains_Mono'] text-[11px] text-[#bec8d2] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#0ea5e9] inline-block animate-pulse" />
            HYDRO-FLOW: 120m³/s
          </span>
        </div>
      </div>

      {/* Interactive Vector GIS Canvas */}
      <div className="relative w-full aspect-[16/9] max-h-[360px] bg-[#090e1c] overflow-hidden select-none">
        <svg
          id="gis-svg"
          viewBox="0 0 800 450"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Water gradient */}
            <linearGradient id="floodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity={inundationOpacity} />
              <stop offset="100%" stopColor="#00344d" stopOpacity={Math.min(1, inundationOpacity + 0.15)} />
            </linearGradient>

            {/* Pulse Glow Filter */}
            <filter id="glow-danger" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Tactical Grid Pattern */}
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#252a39" strokeWidth="0.75" />
            </pattern>
          </defs>

          {/* Background Tactical Grid */}
          <rect width="800" height="450" fill="url(#grid-pattern)" />

          {/* River Sector Curving through metropolitan zone */}
          <path
            d="M -20,120 C 180,100 240,240 420,220 C 580,200 660,340 820,310 L 820,380 C 640,410 540,280 390,300 C 210,320 160,180 -20,200 Z"
            fill="#0ea5e9"
            fillOpacity="0.35"
          />
          <path
            d="M -20,150 C 180,130 240,270 420,250 C 580,230 660,370 820,340"
            fill="none"
            stroke="#89ceff"
            strokeWidth="3"
            strokeDasharray="8,6"
            opacity="0.8"
          />

          {/* Arterial Roadways Network */}
          {/* North-South Arterial Highway 101 */}
          <line x1="280" y1="0" x2="280" y2="450" stroke="#3e4850" strokeWidth="8" strokeLinecap="round" />
          <line x1="280" y1="0" x2="280" y2="450" stroke="#88929b" strokeWidth="2" strokeDasharray="12,12" />

          {/* East-West Cross Corridor (Hospital Trauma Route) */}
          <path
            id="hospital-route-line"
            d="M 40,280 L 280,280 L 520,190 L 760,190"
            fill="none"
            stroke={hospitalRouteSecure ? "#10b981" : "#ffb4ab"}
            strokeWidth="7"
            strokeLinecap="round"
            opacity="0.9"
          />
          <path
            d="M 40,280 L 280,280 L 520,190 L 760,190"
            fill="none"
            stroke={hospitalRouteSecure ? "#064e3b" : "#93000a"}
            strokeWidth="2"
            strokeDasharray="6,4"
          />

          {/* Drainage Conduit C-4 Vector */}
          <path
            d="M 280,280 L 370,360 L 480,330"
            fill="none"
            stroke="#ffb95f"
            strokeWidth="5"
            strokeDasharray="6,6"
          />

          {/* Dynamic Flood Inundation Polygon */}
          <polygon
            id="flood-inundation-poly"
            points={inundationPoints}
            fill="url(#floodGrad)"
            className="animate-pulse"
          />
          <circle
            cx="330"
            cy="275"
            r="70"
            fill="#0ea5e9"
            fillOpacity={inundationOpacity * 0.3}
            filter="url(#glow-danger)"
          />

          {/* St. Jude Medical Trauma Center Node */}
          <g
            className="cursor-pointer transition-transform hover:scale-105"
            transform="translate(680, 150)"
            onClick={() => onNotify("St. Jude Trauma Hub: Level 1 Emergency Facility. Access corridor preservation is priority P0.")}
          >
            <rect
              width="90"
              height="42"
              rx="4"
              fill="#1a1f2e"
              stroke={hospitalRouteSecure ? "#10b981" : "#ffb4ab"}
              strokeWidth="1"
            />
            <circle cx="16" cy="21" r="10" fill={hospitalRouteSecure ? "#065f46" : "#93000a"} />
            <text x="16" y="25" textAnchor="middle" fill="#ffdad6" fontSize="12" fontWeight="700" fontFamily="Inter">+</text>
            <text x="32" y="18" fill="#dee2f6" fontSize="10" fontWeight="600" fontFamily="Inter">ST. JUDE</text>
            <text x="32" y="30" fill={hospitalRouteSecure ? "#34d399" : "#ffb4ab"} fontSize="9" fontFamily="JetBrains Mono">
              {hospitalRouteSecure ? "CLEAR < 4M" : "TRAUMA HUB"}
            </text>
          </g>

          {/* North Substation 9 Node */}
          <g
            className="cursor-pointer"
            transform="translate(180, 50)"
            onClick={() => onNotify("Substation 9: Feeds 6 municipal districts. Protected by secondary drywell.")}
          >
            <rect width="80" height="34" rx="4" fill="#1a1f2e" stroke="#3e4850" strokeWidth="0.75" />
            <circle cx="14" cy="17" r="6" fill="#ffb95f" />
            <text x="26" y="16" fill="#dee2f6" fontSize="9" fontFamily="Inter">SUBSTATION 9</text>
            <text x="26" y="27" fill="#bec8d2" fontSize="8" fontFamily="JetBrains Mono">POWER: OK</text>
          </g>

          {/* Culvert C-4 Inlet Node */}
          <g
            className="cursor-pointer"
            transform="translate(370, 350)"
            onClick={() => onNotify("Culvert C-4 Inlet: Overloaded at 140% intake capacity. High backwater hydraulic head.")}
          >
            <rect width="95" height="30" rx="3" fill="#1a1f2e" stroke="#ffb95f" strokeWidth="1" />
            <text x="6" y="14" fill="#ffb95f" fontSize="8" fontWeight="700" fontFamily="JetBrains Mono">CULVERT C-4</text>
            <text x="6" y="24" fill={pumps >= 2 ? "#34d399" : "#ffdad6"} fontSize="8" fontFamily="JetBrains Mono">
              {pumps >= 2 ? "PUMPS RUNNING" : "OVERLOAD: 140%"}
            </text>
          </g>

          {/* Apex Node: MAIN JUNCTION A (Interactive Pulsing Tactical Marker) */}
          <g
            id="map-junction-a"
            className="cursor-pointer group"
            transform="translate(280, 280)"
            onClick={onOpenApexNodeModal}
          >
            <circle cx="0" cy="0" r="32" fill="#ffb4ab" fillOpacity="0.25" className="animate-ping" />
            <circle cx="0" cy="0" r="18" fill="#93000a" stroke="#ffb4ab" strokeWidth="2" />
            <circle cx="0" cy="0" r="7" fill="#ffdad6" />

            {/* Pin callout box */}
            <rect x="18" y="-30" width="132" height="34" rx="4" fill="#090e1c" stroke="#ffb4ab" strokeWidth="1" />
            <text x="24" y="-18" fill="#ffb4ab" fontSize="10" fontWeight="700" fontFamily="JetBrains Mono">MAIN JUNCTION A</text>
            <text x="24" y="-6" fill="#dee2f6" fontSize="9" fontFamily="Inter">CRITICAL BOTTLENECK</text>
          </g>

          {/* Active River Surge Waves Animation Vector */}
          <path
            d="M 120,165 Q 160,150 200,165 T 280,165"
            fill="none"
            stroke="#89ceff"
            strokeWidth="2"
            opacity="0.6"
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; 25,10; 0,0"
              dur="4s"
              repeatCount="indefinite"
            />
          </path>
        </svg>

        {/* Floating Telemetry Badge Bottom-Left */}
        <div className="absolute bottom-2 left-2 flex items-center gap-2 bg-[#1a1f2e]/90 backdrop-blur-md px-2.5 py-1 rounded border border-[#3e4850] shadow-md">
          <span className={`w-2 h-2 rounded-full ${currentStage > zone.thresholdNum ? 'bg-[#ffb4ab] animate-pulse' : 'bg-[#10b981]'}`} />
          <span className="font-['JetBrains_Mono'] text-[11px] text-[#dee2f6]">
            SURGE LEVEL: <span className={`font-bold ${currentStage > zone.thresholdNum ? 'text-[#ffb4ab]' : 'text-[#34d399]'}`}>{currentStage}m</span> / THRESHOLD ({zone.thresholdNum.toFixed(2)}m)
          </span>
        </div>

        {/* Floating Warning Tag Top-Right */}
        <div className={`absolute top-2 right-2 flex items-center gap-1.5 backdrop-blur-md px-2 py-1 rounded border shadow-md ${
          hospitalRouteSecure 
            ? 'bg-[#064e3b]/80 border-[#10b981] text-[#34d399]' 
            : 'bg-[#1a1f2e]/90 border-[#d88a00] text-[#ffb95f]'
        }`}>
          <span className="material-symbols-outlined text-[14px]">
            {hospitalRouteSecure ? 'check_circle' : 'warning'}
          </span>
          <span className="font-['JetBrains_Mono'] text-[10px] font-bold uppercase tracking-wider">
            {hospitalRouteSecure ? 'ST. JUDE ACCESS SECURED' : 'ST. JUDE ACCESS AT RISK'}
          </span>
        </div>
      </div>

      {/* Telemetry Strip below Map */}
      <div className="grid grid-cols-2 sm:grid-cols-4 bg-[#252a39] py-1.5 px-3 gap-2 font-['JetBrains_Mono'] text-[11px] text-[#bec8d2] border-t border-[#3e4850]">
        <div>
          RAIN INTENSITY: <span className="text-[#dee2f6] font-bold">{zone.rainMm}</span>
        </div>
        <div>
          RUNOFF VELOCITY: <span className="text-[#89ceff] font-bold">3.4 m/s</span>
        </div>
        <div>
          BARRIER DEFICIT:{' '}
          <span className={`font-bold ${barrierDeficit > 0 ? 'text-[#ffb4ab]' : 'text-[#89ceff]'}`}>
            {barrierDeficit > 0 ? `-${barrierDeficit} UNITS` : 'ADEQUATE'}
          </span>
        </div>
        <div>
          EST. CREST TIME: <span className="text-[#ffb95f] font-bold">{zone.crestTime}</span>
        </div>
      </div>
    </section>
  );
};
