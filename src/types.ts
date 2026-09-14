export type ZoneId = 'A' | 'B' | 'C' | 'D';

export type ActiveTab = 'command' | 'what-if' | 'compare' | 'playbook';

export type EngineMode = 'NUGEN' | 'GEMINI' | 'FALLBACK';

export interface ZoneData {
  id: ZoneId;
  name: string;
  label: string;
  score: number;
  severity: string;
  severityColor: string;
  severityBg: string;
  rainPct: number;
  drainPct: number;
  elevPct: number;
  roadPct: number;
  cascade: number;
  pop: string;
  popNum: number;
  closure: number;
  cause: string;
  assets: string;
  riverStage: string;
  riverStageNum: number;
  thresholdNum: number;
  rainMm: string;
  rainMmNum: number;
  crestTime: string;
}

export interface TacticalResources {
  pumps: number;
  rescueTeams: number;
  barricades: number;
}

export interface InterventionPlan {
  directive: string;
  rationale: string;
  targetCascade: string;
  projectedPayoff: string;
  confidence: number;
  priority: string;
  executionWindow: string;
  isSimulated: boolean;
}

export interface WhatIfState {
  rainIntensity: number; // mm/hr (10 - 120)
  damDischarge: number; // m3/s (0 - 250)
  activePumps: number; // units (0 - 6)
  barricadeSets: number; // sets (0 - 8)
  sluiceAperture: number; // % (0 - 100)
}

export interface ScenarioMatrix {
  id: string;
  title: string;
  tag: string;
  tagColor: string;
  pumps: number;
  barricades: number;
  hospitalAccessTime: number; // minutes
  populationExposed: number;
  inundationArea: number; // sq km
  economicDamage: number; // $ millions
  feasibilityScore: number; // / 100
  summary: string;
  apexSecured: boolean;
}

export interface PlaybookTask {
  id: string;
  title: string;
  assignee: string;
  dueMin: number;
  completed: boolean;
  critical: boolean;
}

export interface PlaybookSOP {
  id: string;
  code: string;
  title: string;
  priority: 'P0' | 'P1' | 'P2';
  description: string;
  estimatedDuration: string;
  targetZone: ZoneId;
  tasks: PlaybookTask[];
}
