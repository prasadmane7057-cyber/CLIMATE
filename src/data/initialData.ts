import { ZoneData, ZoneId, ScenarioMatrix, PlaybookSOP } from '../types';

export const ZONES_DATA: Record<ZoneId, ZoneData> = {
  A: {
    id: 'A',
    name: 'ZONE A',
    label: 'Metro Riverside',
    score: 87,
    severity: 'CRITICAL BREACH',
    severityColor: 'text-error',
    severityBg: 'bg-error-container',
    rainPct: 38,
    drainPct: 24,
    elevPct: 15,
    roadPct: 10,
    cascade: 92,
    pop: '4,800',
    popNum: 4800,
    closure: 82,
    cause: 'Drainage Overload (Culvert C-4 surge beyond 140% safe threshold)',
    assets: 'Main Junction A, St. Jude Medical Corridor, Substation 9',
    riverStage: '4.82m',
    riverStageNum: 4.82,
    thresholdNum: 4.10,
    rainMm: '52 mm/hr',
    rainMmNum: 52,
    crestTime: '+24 MIN'
  },
  B: {
    id: 'B',
    name: 'ZONE B',
    label: 'Upper Basin',
    score: 64,
    severity: 'HIGH ELEVATION',
    severityColor: 'text-tertiary',
    severityBg: 'bg-tertiary-container',
    rainPct: 32,
    drainPct: 18,
    elevPct: 22,
    roadPct: 8,
    cascade: 68,
    pop: '2,350',
    popNum: 2350,
    closure: 54,
    cause: 'Reservoir spillway discharge overflow and soil saturation',
    assets: 'Upper Basin Highway, East Gate Dam, Agricultural Flats',
    riverStage: '3.10m',
    riverStageNum: 3.10,
    thresholdNum: 3.40,
    rainMm: '38 mm/hr',
    rainMmNum: 38,
    crestTime: '+45 MIN'
  },
  C: {
    id: 'C',
    name: 'ZONE C',
    label: 'Port District',
    score: 41,
    severity: 'MODERATE SURGE',
    severityColor: 'text-on-surface-variant',
    severityBg: 'bg-surface-variant',
    rainPct: 18,
    drainPct: 12,
    elevPct: 8,
    roadPct: 14,
    cascade: 35,
    pop: '1,120',
    popNum: 1120,
    closure: 29,
    cause: 'Tidal backwater & dock conduit sedimentation',
    assets: 'Pier 4 Cargo Yard, Marine Transit Way, Shipping Crane #2',
    riverStage: '2.20m',
    riverStageNum: 2.20,
    thresholdNum: 2.80,
    rainMm: '22 mm/hr',
    rainMmNum: 22,
    crestTime: '+90 MIN'
  },
  D: {
    id: 'D',
    name: 'ZONE D',
    label: 'Highlands',
    score: 18,
    severity: 'NOMINAL RISK',
    severityColor: 'text-primary',
    severityBg: 'bg-surface-container-lowest',
    rainPct: 10,
    drainPct: 5,
    elevPct: 2,
    roadPct: 4,
    cascade: 12,
    pop: '340',
    popNum: 340,
    closure: 8,
    cause: 'Minor gutter surface flow and rapid permeable infiltration',
    assets: 'North Valley Trailhead, Hillside Water Tower',
    riverStage: '1.05m',
    riverStageNum: 1.05,
    thresholdNum: 2.50,
    rainMm: '11 mm/hr',
    rainMmNum: 11,
    crestTime: '+180 MIN'
  }
};

export const SCENARIO_COMPARISONS: ScenarioMatrix[] = [
  {
    id: 's0',
    title: 'Baseline: Unmitigated Inaction',
    tag: 'DO NOTHING',
    tagColor: 'bg-error-container text-on-error-container',
    pumps: 0,
    barricades: 0,
    hospitalAccessTime: 23, // 23 min delay!
    populationExposed: 4800,
    inundationArea: 8.4,
    economicDamage: 42.5,
    feasibilityScore: 10,
    summary: 'Culvert C-4 backwater inundates Main Junction A within 18 minutes. Trauma transport severed, 4,800 citizens subjected to property and vehicular water damage.',
    apexSecured: false
  },
  {
    id: 's1',
    title: 'Scenario 1: Sluice Gate Diversion Only',
    tag: 'HYDRAULIC ONLY',
    tagColor: 'bg-tertiary-container text-on-tertiary-container',
    pumps: 0,
    barricades: 2,
    hospitalAccessTime: 14,
    populationExposed: 3200,
    inundationArea: 5.6,
    economicDamage: 27.0,
    feasibilityScore: 65,
    summary: 'Opening east canal sluices relieves river stage by 0.35m, but localized culvert bottleneck still triggers 14-minute emergency transit delay.',
    apexSecured: false
  },
  {
    id: 's2',
    title: 'Scenario 2: Mass Sector Evacuation',
    tag: 'CIVIL EVAC',
    tagColor: 'bg-surface-container-high text-on-surface',
    pumps: 1,
    barricades: 5,
    hospitalAccessTime: 31,
    populationExposed: 1200,
    inundationArea: 8.1,
    economicDamage: 38.0,
    feasibilityScore: 40,
    summary: 'Civil evacuation creates catastrophic vehicle gridlock at Junction A before flood peak. High secondary danger of trapped vehicles.',
    apexSecured: false
  },
  {
    id: 's3',
    title: 'Scenario 3: ClimaForge Apex Intervention',
    tag: 'RECOMMENDED (AI)',
    tagColor: 'bg-primary-container text-on-primary-container font-bold',
    pumps: 2,
    barricades: 3,
    hospitalAccessTime: 3.8, // < 5 min constraint satisfied!
    populationExposed: 850,
    inundationArea: 1.8,
    economicDamage: 6.2,
    feasibilityScore: 94,
    summary: 'Targeted pump deployment at Culvert C-4 inlet breaks backwater cascade. Barricades shield 4th Ave ambulance express lane. Corridor intact in < 4 min.',
    apexSecured: true
  }
];

export const PLAYBOOK_SOPS: PlaybookSOP[] = [
  {
    id: 'sop-1',
    code: 'SOP-HYD-01',
    title: 'Hospital Trauma Corridor Preservation',
    priority: 'P0',
    description: 'Establish hydraulic bypass at Culvert C-4 and stage inflatable barrier line along 4th Ave to prevent water intrusion into St. Jude emergency approach.',
    estimatedDuration: '14 minutes',
    targetZone: 'A',
    tasks: [
      { id: 't1-1', title: 'Dispatch Mobile Pump Array #1 (40 m³/s) to Culvert C-4 inlet', assignee: 'Public Works Fleet 3', dueMin: 5, completed: true, critical: true },
      { id: 't1-2', title: 'Verify culvert intake grating free of debris obstruction', assignee: 'Hazmat Recon Unit 1', dueMin: 8, completed: true, critical: false },
      { id: 't1-3', title: 'Deploy 200m inflatable barricade perimeter along 4th & Riverside', assignee: 'Fire Rescue Squad 4', dueMin: 12, completed: false, critical: true },
      { id: 't1-4', title: 'Coordinate emergency vehicle diversion route with Police Dispatch', assignee: 'Traffic Operations Hub', dueMin: 14, completed: false, critical: false }
    ]
  },
  {
    id: 'sop-2',
    code: 'SOP-PWR-04',
    title: 'Substation 9 Electrical Isolation & Sandbagging',
    priority: 'P1',
    description: 'Defend high-voltage stepdown transformers at Substation 9 against rising backwater to prevent cascading power blackout across 6 districts.',
    estimatedDuration: '25 minutes',
    targetZone: 'A',
    tasks: [
      { id: 't2-1', title: 'Engage automated drywell sump pumps at Transformer Bay B', assignee: 'Grid Control Remote', dueMin: 4, completed: true, critical: true },
      { id: 't2-2', title: 'Stage rapid-fill geotextile sandbag berm around control bunker', assignee: 'National Guard Detail', dueMin: 15, completed: false, critical: true },
      { id: 't2-3', title: 'Prepare secondary feed transfer to Highlands Substation D', assignee: 'Municipal Energy Dispatch', dueMin: 22, completed: false, critical: false }
    ]
  },
  {
    id: 'sop-3',
    code: 'SOP-EVAC-02',
    title: 'Zone A Low-Lying Citizen Evacuation & Zodiac Boat Staging',
    priority: 'P1',
    description: 'Pre-position zodiac rescue squads at 2nd Street cul-de-sac for vulnerable citizens and mobility-impaired residents before road cutoff.',
    estimatedDuration: '30 minutes',
    targetZone: 'A',
    tasks: [
      { id: 't3-1', title: 'Broadcast cellular emergency geo-targeted alert (Zone A lowlands)', assignee: 'Civil Defense EOC', dueMin: 3, completed: true, critical: false },
      { id: 't3-2', title: 'Stage 2x Zodiac rescue boats at Riverside staging depot', assignee: 'Water Rescue Squad 2', dueMin: 10, completed: true, critical: true },
      { id: 't3-3', title: 'Perform door-to-door welfare checks for registered elderly residents', assignee: 'Volunteer Corps Delta', dueMin: 25, completed: false, critical: false }
    ]
  },
  {
    id: 'sop-4',
    code: 'SOP-HAZ-07',
    title: 'Port District Chemical Runoff Containment',
    priority: 'P2',
    description: 'Deploy floating oil/chemical absorbent booms across Pier 4 discharge canal to intercept industrial solvent washouts caused by storm surge.',
    estimatedDuration: '45 minutes',
    targetZone: 'C',
    tasks: [
      { id: 't4-1', title: 'Inspect retention basins at chemical warehouse sector', assignee: 'Port Authority Safety', dueMin: 15, completed: false, critical: true },
      { id: 't4-2', title: 'Anchor heavy marine containment boom across canal mouth', assignee: 'Harbor Patrol Unit 7', dueMin: 30, completed: false, critical: true }
    ]
  }
];
