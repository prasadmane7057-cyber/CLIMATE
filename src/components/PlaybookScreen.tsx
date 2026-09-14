import React, { useState } from 'react';
import { PLAYBOOK_SOPS } from '../data/initialData';
import { PlaybookSOP } from '../types';

interface PlaybookScreenProps {
  onNotify: (msg: string) => void;
}

export const PlaybookScreen: React.FC<PlaybookScreenProps> = ({ onNotify }) => {
  const [sops, setSops] = useState<PlaybookSOP[]>(PLAYBOOK_SOPS);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'P0' | 'P1'>('ALL');
  const [expandedSopId, setExpandedSopId] = useState<string>('sop-1');

  const toggleTask = (sopId: string, taskId: string) => {
    setSops(prev =>
      prev.map(s => {
        if (s.id !== sopId) return s;
        const updatedTasks = s.tasks.map(t =>
          t.id === taskId ? { ...t, completed: !t.completed } : t
        );
        return { ...s, tasks: updatedTasks };
      })
    );
    onNotify("Task status updated in EOC ICS-204 ledger.");
  };

  const filteredSops = sops.filter(s => {
    if (activeFilter === 'ALL') return true;
    return s.priority === activeFilter;
  });

  return (
    <div className="flex flex-col gap-4 p-4 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#1a1f2e] p-4 rounded-xl border border-[#252a39] shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#89ceff] text-[20px]">menu_book</span>
            <span className="font-['JetBrains_Mono'] text-[10px] text-[#89ceff] uppercase font-bold tracking-wider">
              EMERGENCY OPERATIONS CENTER (ICS-204)
            </span>
          </div>
          <h1 className="font-['Inter'] text-[20px] font-bold text-[#dee2f6] mt-0.5">
            Tactical Emergency SOP Playbook
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Priority Filters */}
          <div className="flex items-center bg-[#090e1c] p-1 rounded-lg border border-[#252a39]">
            {(['ALL', 'P0', 'P1'] as const).map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1 rounded text-[11px] font-mono font-bold transition-colors ${
                  activeFilter === filter
                    ? 'bg-[#89ceff] text-[#00344d]'
                    : 'text-[#bec8d2] hover:text-[#dee2f6]'
                }`}
              >
                {filter === 'ALL' ? 'ALL SOPS' : `${filter} ONLY`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SOP Cards Accordion List */}
      <div className="flex flex-col gap-3">
        {filteredSops.map(sop => {
          const isExpanded = expandedSopId === sop.id;
          const completedCount = sop.tasks.filter(t => t.completed).length;
          const allCompleted = completedCount === sop.tasks.length;

          return (
            <div
              key={sop.id}
              className={`rounded-xl border transition-all ${
                isExpanded
                  ? 'bg-[#1a1f2e] border-[#89ceff]/50 shadow-md'
                  : 'bg-[#161b2a] border-[#252a39] hover:bg-[#1a1f2e]'
              }`}
            >
              {/* SOP Header Accordion Bar */}
              <div
                onClick={() => setExpandedSopId(isExpanded ? '' : sop.id)}
                className="p-4 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`font-['JetBrains_Mono'] text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                    sop.priority === 'P0' ? 'bg-[#93000a] text-[#ffdad6] animate-pulse' :
                    sop.priority === 'P1' ? 'bg-[#d88a00] text-[#4a2c00]' :
                    'bg-[#252a39] text-[#dee2f6]'
                  }`}>
                    {sop.priority}
                  </span>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-['JetBrains_Mono'] text-[11px] text-[#88929b] font-bold">
                        {sop.code}
                      </span>
                      <span className="font-['Inter'] text-[15px] font-bold text-[#dee2f6] truncate">
                        {sop.title}
                      </span>
                    </div>
                    <span className="font-['Inter'] text-[12px] text-[#bec8d2] truncate">
                      Target: Zone {sop.targetZone} • Est. Window: {sop.estimatedDuration}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="font-['JetBrains_Mono'] text-[11px] text-[#bec8d2]">
                      Progress: {completedCount}/{sop.tasks.length}
                    </span>
                    <span className={`font-['JetBrains_Mono'] text-[10px] font-bold ${allCompleted ? 'text-[#34d399]' : 'text-[#ffb95f]'}`}>
                      {allCompleted ? 'COMPLETED' : 'IN EXECUTION'}
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-[#88929b] text-[20px] transition-transform duration-200">
                    {isExpanded ? 'expand_less' : 'expand_more'}
                  </span>
                </div>
              </div>

              {/* SOP Content Drilldown */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-[#252a39] pt-3 flex flex-col gap-3">
                  <p className="font-['Inter'] text-[13px] text-[#bec8d2] leading-relaxed bg-[#090e1c] p-3 rounded-lg border border-[#252a39]">
                    {sop.description}
                  </p>

                  <div className="flex flex-col gap-2">
                    <span className="font-['JetBrains_Mono'] text-[10px] text-[#89ceff] font-bold uppercase tracking-wider">
                      OPERATIONAL ASSIGNMENT CHECKLIST (CLICK TO CONFIRM COMPLETION)
                    </span>
                    {sop.tasks.map(task => (
                      <div
                        key={task.id}
                        onClick={() => toggleTask(sop.id, task.id)}
                        className={`flex items-start justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                          task.completed
                            ? 'bg-[#064e3b]/20 border-[#10b981]/40 text-[#dee2f6]'
                            : 'bg-[#161b2a] border-[#252a39] hover:bg-[#252a39] text-[#bec8d2]'
                        }`}
                      >
                        <div className="flex items-start gap-2.5 min-w-0">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => {}} // handled by parent onClick
                            className="mt-1 w-4 h-4 rounded accent-[#0ea5e9] cursor-pointer"
                          />
                          <div className="flex flex-col min-w-0">
                            <span className={`font-['Inter'] text-[13px] font-medium leading-snug ${
                              task.completed ? 'line-through opacity-70' : 'text-[#dee2f6]'
                            }`}>
                              {task.title}
                            </span>
                            <span className="font-['JetBrains_Mono'] text-[11px] text-[#88929b] mt-0.5">
                              Assignee: <strong className="text-[#dee2f6]">{task.assignee}</strong> • Time Limit: T+{task.dueMin}m
                            </span>
                          </div>
                        </div>

                        {task.critical && (
                          <span className="font-['JetBrains_Mono'] text-[9px] bg-[#93000a] text-[#ffdad6] px-1.5 py-0.5 rounded font-bold uppercase shrink-0">
                            CRITICAL
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#252a39]">
                    <span className="font-['JetBrains_Mono'] text-[11px] text-[#88929b]">
                      Command Log ID: CLIMAFORGE-ICS-{sop.code}
                    </span>
                    <button
                      onClick={() => onNotify(`Transmitted ICS-204 TAP dispatch report for ${sop.title}`)}
                      className="bg-[#252a39] hover:bg-[#303444] text-[#89ceff] font-mono text-[11px] font-bold px-3 py-1.5 rounded border border-[#3e4850] transition-colors"
                    >
                      Export IAP Dispatch Summary
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
