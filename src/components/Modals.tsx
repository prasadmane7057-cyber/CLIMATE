import React from 'react';

interface ModalsProps {
  showNodeModal: boolean;
  onCloseNodeModal: () => void;
  showActionModal: boolean;
  onCloseActionModal: () => void;
  showDispatchModal: boolean;
  onCloseDispatchModal: () => void;
  toastMsg: string | null;
}

export const Modals: React.FC<ModalsProps> = ({
  showNodeModal,
  onCloseNodeModal,
  showActionModal,
  onCloseActionModal,
  showDispatchModal,
  onCloseDispatchModal,
  toastMsg
}) => {
  return (
    <>
      {/* 1. Modal: Why This Node? */}
      {showNodeModal && (
        <div className="fixed inset-0 z-50 bg-[#0e1321]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1a1f2e] w-full max-w-lg rounded-xl p-5 border border-[#3e4850] shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-[#252a39] pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#89ceff] text-[24px]">hub</span>
                <h3 className="font-['Inter'] text-[18px] font-bold text-[#dee2f6]">
                  Apex Leverage Node: Main Junction A
                </h3>
              </div>
              <button
                onClick={onCloseNodeModal}
                className="w-8 h-8 rounded-full bg-[#252a39] hover:bg-[#303444] flex items-center justify-center text-[#bec8d2] hover:text-[#dee2f6] transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="bg-[#090e1c] p-3 rounded-lg border border-[#252a39] flex flex-col gap-1">
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#89ceff] font-bold uppercase tracking-wider">
                DETERMINISTIC FORMULA &amp; WEIGHTINGS
              </span>
              <p className="font-['JetBrains_Mono'] text-[12px] text-[#dee2f6]">
                Score = 0.40(Hydraulic Head) + 0.35(Route Criticality) + 0.25(Disruption Multiplier)
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center bg-[#161b2a] px-3 py-2 rounded border border-[#252a39]">
                <span className="font-['Inter'] text-[12px] text-[#bec8d2]">Topological Centrality (Betweenness)</span>
                <span className="font-['JetBrains_Mono'] text-[12px] font-bold text-[#89ceff]">0.96 / 1.0</span>
              </div>
              <div className="flex justify-between items-center bg-[#161b2a] px-3 py-2 rounded border border-[#252a39]">
                <span className="font-['Inter'] text-[12px] text-[#bec8d2]">Culvert C-4 Backwater Amplification</span>
                <span className="font-['JetBrains_Mono'] text-[12px] font-bold text-[#ffb4ab]">1.40x Over Cap</span>
              </div>
              <div className="flex justify-between items-center bg-[#161b2a] px-3 py-2 rounded border border-[#252a39]">
                <span className="font-['Inter'] text-[12px] text-[#bec8d2]">St. Jude Medical Route Vulnerability</span>
                <span className="font-['JetBrains_Mono'] text-[12px] font-bold text-[#ffb95f]">Fatal Single Point of Failure</span>
              </div>
              <div className="flex justify-between items-center bg-[#161b2a] px-3 py-2 rounded border border-[#ffb4ab]/40">
                <span className="font-['Inter'] text-[13px] font-semibold text-[#dee2f6]">Calculated Apex Leverage Score</span>
                <span className="font-['JetBrains_Mono'] text-[13px] font-bold text-[#ffb4ab]">9.4 / 10.0</span>
              </div>
            </div>

            <p className="font-['Inter'] text-[12px] text-[#bec8d2] leading-relaxed">
              <strong>Mathematical Conclusion:</strong> Intervening at any downstream road segment yields less than 22% overall efficacy because stormwater continues backflowing from Culvert C-4 into Junction A. Stabilizing Junction A severs the upstream hydraulic domino at the source.
            </p>

            <button
              onClick={onCloseNodeModal}
              className="w-full h-10 bg-[#89ceff] hover:bg-[#c9e6ff] text-[#00344d] rounded-lg font-['Inter'] text-[13px] font-bold transition-all shadow-md mt-1"
            >
              Acknowledge Node Priority
            </button>
          </div>
        </div>
      )}

      {/* 2. Modal: Why This Action? */}
      {showActionModal && (
        <div className="fixed inset-0 z-50 bg-[#0e1321]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1a1f2e] w-full max-w-lg rounded-xl p-5 border border-[#3e4850] shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-[#252a39] pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ffb95f] text-[24px]">psychology_alt</span>
                <h3 className="font-['Inter'] text-[18px] font-bold text-[#dee2f6]">
                  Action Synthesis: Dual Pump &amp; Barrier Plan
                </h3>
              </div>
              <button
                onClick={onCloseActionModal}
                className="w-8 h-8 rounded-full bg-[#252a39] hover:bg-[#303444] flex items-center justify-center text-[#bec8d2] hover:text-[#dee2f6] transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="space-y-2.5">
              <div className="bg-[#161b2a] p-3 rounded-lg border border-[#252a39]">
                <span className="font-['Inter'] text-[14px] font-bold text-[#89ceff] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">water_drop</span>
                  Component 1: 1x Mobile Pump at Culvert C-4
                </span>
                <p className="font-['Inter'] text-[12px] text-[#bec8d2] mt-1 leading-relaxed">
                  Reduces hydraulic head by 40 m³/s, immediately reducing culvert load from 140% to 94% safe operational capacity. Halts street level spill within 9 minutes.
                </p>
              </div>

              <div className="bg-[#161b2a] p-3 rounded-lg border border-[#252a39]">
                <span className="font-['Inter'] text-[14px] font-bold text-[#ffb95f] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">fence</span>
                  Component 2: 2x Modular Barricades on 4th Ave
                </span>
                <p className="font-['Inter'] text-[12px] text-[#bec8d2] mt-1 leading-relaxed">
                  Deflects residual sheet runoff into secondary grassy drainage swales, keeping the inbound St. Jude ambulance express lane dry (water depth &lt; 5cm).
                </p>
              </div>

              <div className="bg-[#090e1c] p-3 rounded-lg border border-[#ffb4ab]/30">
                <span className="font-['Inter'] text-[14px] font-bold text-[#ffb4ab] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">block</span>
                  Alternative Discarded: Total Sector Evacuation
                </span>
                <p className="font-['Inter'] text-[12px] text-[#bec8d2] mt-1 leading-relaxed">
                  Discarded due to time required (140 min evacuation window vs 24 min flash crest) and a 90% probability of trapping over 1,200 civilian vehicles in low-lying choke points.
                </p>
              </div>
            </div>

            <button
              onClick={onCloseActionModal}
              className="w-full h-10 bg-[#89ceff] hover:bg-[#c9e6ff] text-[#00344d] rounded-lg font-['Inter'] text-[13px] font-bold transition-all shadow-md mt-1"
            >
              Approve Action Logic
            </button>
          </div>
        </div>
      )}

      {/* 3. Modal: Plan Dispatched Confirmation */}
      {showDispatchModal && (
        <div className="fixed inset-0 z-50 bg-[#0e1321]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1a1f2e] w-full max-w-md rounded-xl p-5 border border-[#10b981] shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#10b981]/20 border border-[#10b981] flex items-center justify-center text-[#10b981] shrink-0">
                <span className="material-symbols-outlined text-[28px]">verified</span>
              </div>
              <div className="flex flex-col">
                <h3 className="font-['Inter'] text-[17px] font-bold text-[#dee2f6]">
                  Tactical Order Transmitted
                </h3>
                <span className="font-['JetBrains_Mono'] text-[11px] text-[#10b981]">
                  ICS-204 INCIDENT ACTION DIRECTIVE ACTIVE
                </span>
              </div>
            </div>

            <p className="font-['Inter'] text-[13px] text-[#bec8d2] leading-relaxed">
              Order dispatched to <strong>EOC Operations Branch</strong>, <strong>Public Works Fleet 3</strong>, and <strong>Traffic Operations Hub</strong>. Live telemetry monitoring initiated on Culvert C-4 pressure sensors.
            </p>

            <div className="bg-[#090e1c] p-3 rounded-lg border border-[#252a39] flex flex-col gap-1 text-xs">
              <div className="flex justify-between">
                <span className="text-[#88929b]">Assigned Units:</span>
                <span className="font-mono text-[#dee2f6]">Pump Unit P-04, Barrier Crew B-02</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#88929b]">Estimated On-Scene:</span>
                <span className="font-mono text-[#ffb95f]">07 min (Within 14 min limit)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#88929b]">Inviolable Constraint:</span>
                <span className="font-mono text-[#10b981]">Hospital Access Protected</span>
              </div>
            </div>

            <button
              onClick={onCloseDispatchModal}
              className="w-full h-10 bg-[#10b981] hover:bg-[#34d399] text-[#064e3b] rounded-lg font-['Inter'] text-[13px] font-bold transition-all shadow-md mt-1"
            >
              Return to Live Radar HUD
            </button>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#0ea5e9] text-[#00344d] font-semibold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 transition-all duration-300 border border-[#89ceff]">
          <span className="material-symbols-outlined text-[18px]">task_alt</span>
          <span className="font-['Inter'] text-[12px]">{toastMsg}</span>
        </div>
      )}
    </>
  );
};
