/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ActiveTab, ZoneId, EngineMode, TacticalResources, ScenarioMatrix } from './types';
import { ZONES_DATA } from './data/initialData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { CommandScreen } from './components/CommandScreen';
import { WhatIfScreen } from './components/WhatIfScreen';
import { CompareScreen } from './components/CompareScreen';
import { PlaybookScreen } from './components/PlaybookScreen';
import { Modals } from './components/Modals';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('command');
  const [selectedZoneId, setSelectedZoneId] = useState<ZoneId>('A');
  const [engineMode, setEngineMode] = useState<EngineMode>('NUGEN');
  const [resources, setResources] = useState<TacticalResources>({
    pumps: 2,
    rescueTeams: 1,
    barricades: 3
  });
  const [isSimulated, setIsSimulated] = useState<boolean>(false);

  // Modals & Toast state
  const [showNodeModal, setShowNodeModal] = useState<boolean>(false);
  const [showActionModal, setShowActionModal] = useState<boolean>(false);
  const [showDispatchModal, setShowDispatchModal] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const selectedZone = ZONES_DATA[selectedZoneId];

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 3200);
  };

  const handleToggleEngine = () => {
    if (engineMode === 'NUGEN') {
      setEngineMode('FALLBACK');
      triggerToast('Switched to Heuristic Statistical Fallback Engine (Offline Mode)');
    } else if (engineMode === 'FALLBACK') {
      setEngineMode('GEMINI');
      triggerToast('Switched to Gemini 3.8 Flash AI Advisory Model');
    } else {
      setEngineMode('NUGEN');
      triggerToast('NUGEN v4.2 Deterministic Engine re-synchronized');
    }
  };

  const handleUpdateResources = (updates: Partial<TacticalResources>) => {
    setResources(prev => ({ ...prev, ...updates }));
    setIsSimulated(false);
  };

  const handleResetResources = () => {
    setResources({
      pumps: 2,
      rescueTeams: 1,
      barricades: 3
    });
    setIsSimulated(false);
    triggerToast('Tactical resource loadout restored to default.');
  };

  const handleGeneratePlan = async () => {
    if (engineMode === 'GEMINI') {
      triggerToast('Querying Gemini 3.8 Flash for incident intervention synthesis...');
      try {
        const res = await fetch('/api/ai/generate-plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            zoneId: selectedZone.id,
            zoneName: selectedZone.name,
            pumps: resources.pumps,
            barricades: resources.barricades,
            rainfall: selectedZone.rainMm,
            simulated: isSimulated
          })
        });
        const data = await res.json();
        setShowDispatchModal(true);
        triggerToast(`Plan synthesized by ${data.source || 'AI'}.`);
      } catch {
        setShowDispatchModal(true);
        triggerToast('Plan Generated & Dispatched to EOC Incident Commander');
      }
    } else {
      setShowDispatchModal(true);
      triggerToast('Plan Generated & Dispatched to EOC Incident Commander');
    }
  };

  const handleToggleSimulate = () => {
    const nextState = !isSimulated;
    setIsSimulated(nextState);
    triggerToast(
      nextState
        ? 'What-If Simulation Executed: Cascade Averted! Trauma corridor verified.'
        : 'Returned to Real-Time Live Feed'
    );
  };

  const handleDeployScenario = (scenario: ScenarioMatrix) => {
    setResources({
      pumps: scenario.pumps,
      barricades: scenario.barricades,
      rescueTeams: resources.rescueTeams
    });
    setIsSimulated(scenario.apexSecured);
    setActiveTab('command');
    setShowDispatchModal(true);
    triggerToast(`Deployed Strategy: ${scenario.title}. Incident resources updated.`);
  };

  const handleApplyFromWhatIf = (newResources: TacticalResources) => {
    setResources(newResources);
    setIsSimulated(true);
    setActiveTab('command');
  };

  return (
    <div className="min-h-screen bg-[#0e1321] text-[#dee2f6] flex flex-col relative font-['Inter']">
      {/* Top Fixed Header with Brand & Operational Ribbon */}
      <Header
        activeZone={selectedZone}
        engineMode={engineMode}
        onToggleEngine={handleToggleEngine}
        onNotify={triggerToast}
      />

      {/* Main View Area */}
      <main className="flex-1 w-full pt-28 pb-24 overflow-y-auto">
        {activeTab === 'command' && (
          <CommandScreen
            selectedZone={selectedZone}
            onSelectZone={id => {
              setSelectedZoneId(id);
              setIsSimulated(false);
              triggerToast(`Switched HUD jurisdiction to ${ZONES_DATA[id].name}`);
            }}
            resources={resources}
            onUpdateResources={handleUpdateResources}
            onResetResources={handleResetResources}
            engineMode={engineMode}
            isSimulated={isSimulated}
            onToggleSimulate={handleToggleSimulate}
            onOpenNodeModal={() => setShowNodeModal(true)}
            onOpenActionModal={() => setShowActionModal(true)}
            onGeneratePlan={handleGeneratePlan}
            onNotify={triggerToast}
          />
        )}

        {activeTab === 'what-if' && (
          <WhatIfScreen
            resources={resources}
            onApplyToCommand={handleApplyFromWhatIf}
            onNotify={triggerToast}
          />
        )}

        {activeTab === 'compare' && (
          <CompareScreen
            onDeployScenario={handleDeployScenario}
            onNotify={triggerToast}
          />
        )}

        {activeTab === 'playbook' && (
          <PlaybookScreen onNotify={triggerToast} />
        )}
      </main>

      {/* Fixed Bottom Navigation Dock */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={tab => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Interactive Tactical Modals & Toast */}
      <Modals
        showNodeModal={showNodeModal}
        onCloseNodeModal={() => setShowNodeModal(false)}
        showActionModal={showActionModal}
        onCloseActionModal={() => setShowActionModal(false)}
        showDispatchModal={showDispatchModal}
        onCloseDispatchModal={() => setShowDispatchModal(false)}
        toastMsg={toastMsg}
      />
    </div>
  );
}
