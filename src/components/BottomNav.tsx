import React from 'react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  const tabs: { id: ActiveTab; label: string; icon: string }[] = [
    { id: 'command', label: 'COMMAND', icon: 'grid_view' },
    { id: 'what-if', label: 'WHAT-IF', icon: 'model_training' },
    { id: 'compare', label: 'COMPARE', icon: 'compare_arrows' },
    { id: 'playbook', label: 'PLAYBOOK', icon: 'menu_book' }
  ];

  return (
    <nav className="fixed bottom-0 w-full z-40 bg-[#0e1321]/95 backdrop-blur-xl border-t border-[#252a39] shadow-[0_-2px_12px_rgba(0,0,0,0.5)]">
      <div className="flex justify-around items-center h-16 max-w-2xl mx-auto px-2">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] px-3 py-1 rounded transition-colors ${
                isActive
                  ? 'text-[#0ea5e9] font-bold'
                  : 'text-[#bec8d2] hover:text-[#dee2f6]'
              }`}
            >
              <span className={`material-symbols-outlined text-[22px] transition-transform ${isActive ? 'scale-110 text-[#0ea5e9]' : ''}`}>
                {tab.icon}
              </span>
              <span className="font-['JetBrains_Mono'] text-[10px] mt-0.5 tracking-wider truncate">
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-[#0ea5e9] mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
