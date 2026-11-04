// Dijkstra-based indoor navigation engine for Sri Vasavi Engineering College Smart Library

// Ground Floor Navigation Graph
export const GF_GRAPH = {
  nodes: {
    'entrance': { x: 45, y: 427, label: 'Main Entrance' },
    'scanners_entry': { x: 100, y: 427, label: 'ID Scanners' },
    'scanners_exit': { x: 175, y: 427, label: 'Turnstile Exit' },
    'main_hub': { x: 250, y: 427, label: 'Central Corridor' },
    'staff_desk_access': { x: 160, y: 580, label: 'Library Staff Desk' },
    'head_room_access': { x: 150, y: 720, label: 'Head of Library Door' },
    'newspaper_stand': { x: 300, y: 350, label: 'Newspaper Stand' },
    'digital_lib_door': { x: 290, y: 150, label: 'Digital Library Entrance' },
    'staircase_gf': { x: 365, y: 220, label: 'Staircase to 1st Floor' },
    
    // Diploma & MBA Aisle
    'diploma_mba_corridor': { x: 440, y: 150, label: 'Diploma & MBA Aisle' },
    'diploma_rack': { x: 450, y: 84, label: 'Diploma Books Rack' },
    'mba_rack': { x: 450, y: 144, label: 'MBA Books Rack' },

    // Study Tables Aisle
    'upper_study_aisle': { x: 590, y: 80, label: 'Upper Study Tables' },
    'mid_study_aisle': { x: 590, y: 280, label: 'Central Study Tables' },

    // Main Racks Aisles
    'stacks_entry': { x: 350, y: 427, label: 'Main Stacks Junction' },
    'col1_corridor_top': { x: 375, y: 430, label: 'Column 1 Walkway North' },
    'col1_corridor_mid': { x: 375, y: 600, label: 'Column 1 Walkway Mid' },
    'col1_corridor_bottom': { x: 375, y: 785, label: 'Column 1 Walkway South' },

    'center_corridor_top': { x: 550, y: 430, label: 'Aisle between Col 1 & 2' },
    'center_corridor_mid': { x: 550, y: 600, label: 'Center Stacks Aisle' },
    'center_corridor_bottom': { x: 550, y: 785, label: 'Center Stacks South' },

    'col2_corridor_top': { x: 725, y: 430, label: 'Column 2 Walkway North' },
    'col2_corridor_mid': { x: 725, y: 600, label: 'Column 2 Walkway Mid' },
    'col2_corridor_bottom': { x: 725, y: 785, label: 'Column 2 Walkway South' },

    // Column 1 Racks (1 to 10)
    'GF-R10': { x: 375, y: 443, label: 'Rack 10 (CSE)' },
    'GF-R09': { x: 375, y: 481, label: 'Rack 9 (CSE)' },
    'GF-R08': { x: 375, y: 519, label: 'Rack 8 (ECE)' },
    'GF-R07': { x: 375, y: 557, label: 'Rack 7 (ECE)' },
    'GF-R06': { x: 375, y: 595, label: 'Rack 6 (EEE)' },
    'GF-R05': { x: 375, y: 633, label: 'Rack 5 (EEE)' },
    'GF-R04': { x: 375, y: 671, label: 'Rack 4 (Mechanical)' },
    'GF-R03': { x: 375, y: 709, label: 'Rack 3 (Mechanical)' },
    'GF-R02': { x: 375, y: 747, label: 'Rack 2 (Civil)' },
    'GF-R01': { x: 375, y: 785, label: 'Rack 1 (Civil)' },

    // Column 2 Racks (11 to 20)
    'GF-R11': { x: 725, y: 443, label: 'Rack 11 (AI & ML)' },
    'GF-R12': { x: 725, y: 481, label: 'Rack 12 (AI & ML)' },
    'GF-R13': { x: 725, y: 519, label: 'Rack 13 (AI)' },
    'GF-R14': { x: 725, y: 557, label: 'Rack 14 (Maths)' },
    'GF-R15': { x: 725, y: 595, label: 'Rack 15 (Maths)' },
    'GF-R16': { x: 725, y: 633, label: 'Rack 16 (Chemistry)' },
    'GF-R17': { x: 725, y: 671, label: 'Rack 17 (Physics)' },
    'GF-R18': { x: 725, y: 709, label: 'Rack 18 (English)' },
    'GF-R19': { x: 725, y: 747, label: 'Rack 19 (Competitive Exam)' },
    'GF-R20': { x: 725, y: 785, label: 'Rack 20 (General Reading)' }
  },
  edges: [
    ['entrance', 'scanners_entry'],
    ['scanners_entry', 'scanners_exit'],
    ['scanners_exit', 'main_hub'],
    ['main_hub', 'staff_desk_access'],
    ['staff_desk_access', 'head_room_access'],
    ['main_hub', 'newspaper_stand'],
    ['newspaper_stand', 'digital_lib_door'],
    ['newspaper_stand', 'staircase_gf'],
    ['digital_lib_door', 'staircase_gf'],
    ['staircase_gf', 'diploma_mba_corridor'],
    ['diploma_mba_corridor', 'diploma_rack'],
    ['diploma_mba_corridor', 'mba_rack'],
    ['diploma_mba_corridor', 'upper_study_aisle'],
    ['newspaper_stand', 'mid_study_aisle'],
    ['main_hub', 'stacks_entry'],
    ['stacks_entry', 'col1_corridor_top'],
    ['stacks_entry', 'center_corridor_top'],
    ['stacks_entry', 'col2_corridor_top'],

    ['col1_corridor_top', 'GF-R10'],
    ['GF-R10', 'GF-R09'],
    ['GF-R09', 'GF-R08'],
    ['GF-R08', 'GF-R07'],
    ['GF-R07', 'GF-R06'],
    ['GF-R06', 'col1_corridor_mid'],
    ['col1_corridor_mid', 'GF-R05'],
    ['GF-R05', 'GF-R04'],
    ['GF-R04', 'GF-R03'],
    ['GF-R03', 'GF-R02'],
    ['GF-R02', 'GF-R01'],
    ['GF-R01', 'col1_corridor_bottom'],

    ['center_corridor_top', 'center_corridor_mid'],
    ['center_corridor_mid', 'center_corridor_bottom'],
    ['col1_corridor_bottom', 'center_corridor_bottom'],
    ['center_corridor_bottom', 'col2_corridor_bottom'],

    ['col2_corridor_top', 'GF-R11'],
    ['GF-R11', 'GF-R12'],
    ['GF-R12', 'GF-R13'],
    ['GF-R13', 'GF-R14'],
    ['GF-R14', 'GF-R15'],
    ['GF-R15', 'col2_corridor_mid'],
    ['col2_corridor_mid', 'GF-R16'],
    ['GF-R16', 'GF-R17'],
    ['GF-R17', 'GF-R18'],
    ['GF-R18', 'GF-R19'],
    ['GF-R19', 'GF-R20'],
    ['GF-R20', 'col2_corridor_bottom']
  ]
};

// First Floor Navigation Graph
export const FF_GRAPH = {
  nodes: {
    'staircase_1f': { x: 365, y: 220, label: 'First Floor Staircase Landing' },
    
    // Left zone: Charging benches
    'charging_junction': { x: 260, y: 150, label: 'Charging Zone Entrance' },
    'lcb_aisle_top': { x: 260, y: 85, label: 'Charging Bench 1 Aisle' },
    'lcb_aisle_mid': { x: 260, y: 150, label: 'Charging Bench 2 Aisle' },
    'lcb_aisle_bot': { x: 260, y: 215, label: 'Charging Bench 3 Aisle' },

    // North corridor: Project Working Rooms
    'project_hallway_west': { x: 440, y: 220, label: 'Project Rooms West' },
    'pwr_1_door': { x: 532, y: 215, label: 'Project Room 1 Door' },
    'pwr_2_door': { x: 657, y: 215, label: 'Project Room 2 Door' },
    'pwr_3_door': { x: 782, y: 215, label: 'Project Room 3 Door' },
    'pwr_4_door': { x: 907, y: 215, label: 'Project Room 4 Door' },

    // Center zone: Study Tables & SC/ST
    'center_hallway_top': { x: 440, y: 300, label: 'First Floor Central Hall' },
    'study_tables_1f': { x: 300, y: 390, label: '1F Study Tables Aisle' },
    'scst_junction': { x: 300, y: 500, label: 'SC/ST Book Bank Aisle' },
    '1F-SCST-1': { x: 300, y: 521, label: 'SC/ST Books Rack 1' },
    '1F-SCST-2': { x: 300, y: 576, label: 'SC/ST Books Rack 2' },

    // Right zone: Reference Stacks (1 to 11)
    'ref_entry': { x: 620, y: 250, label: 'Reference Stacks Entrance' },
    '1F-R01': { x: 620, y: 283, label: 'Ref Rack 1 (Civil)' },
    '1F-R02': { x: 620, y: 321, label: 'Ref Rack 2 (Mechanical)' },
    '1F-R03': { x: 620, y: 359, label: 'Ref Rack 3 (Electrical)' },
    '1F-R04': { x: 620, y: 397, label: 'Ref Rack 4 (ECE)' },
    '1F-R05': { x: 620, y: 435, label: 'Ref Rack 5 (CSE)' },
    '1F-R06': { x: 620, y: 473, label: 'Ref Rack 6 (AI & ML)' },
    '1F-R07': { x: 620, y: 511, label: 'Ref Rack 7 (AI)' },
    '1F-R08': { x: 620, y: 549, label: 'Ref Rack 8 (Mathematics)' },
    '1F-R09': { x: 620, y: 587, label: 'Ref Rack 9 (Chemistry)' },
    '1F-R10': { x: 620, y: 625, label: 'Ref Rack 10 (Physics)' },
    '1F-R11': { x: 620, y: 663, label: 'Ref Rack 11 (English)' },
    'ref_bottom': { x: 620, y: 700, label: 'Reference Aisle End' }
  },
  edges: [
    ['staircase_1f', 'charging_junction'],
    ['charging_junction', 'lcb_aisle_top'],
    ['charging_junction', 'lcb_aisle_mid'],
    ['charging_junction', 'lcb_aisle_bot'],

    ['staircase_1f', 'project_hallway_west'],
    ['project_hallway_west', 'pwr_1_door'],
    ['pwr_1_door', 'pwr_2_door'],
    ['pwr_2_door', 'pwr_3_door'],
    ['pwr_3_door', 'pwr_4_door'],

    ['project_hallway_west', 'center_hallway_top'],
    ['center_hallway_top', 'study_tables_1f'],
    ['study_tables_1f', 'scst_junction'],
    ['scst_junction', '1F-SCST-1'],
    ['1F-SCST-1', '1F-SCST-2'],

    ['center_hallway_top', 'ref_entry'],
    ['pwr_2_door', 'ref_entry'],
    ['ref_entry', '1F-R01'],
    ['1F-R01', '1F-R02'],
    ['1F-R02', '1F-R03'],
    ['1F-R03', '1F-R04'],
    ['1F-R04', '1F-R05'],
    ['1F-R05', '1F-R06'],
    ['1F-R06', '1F-R07'],
    ['1F-R07', '1F-R08'],
    ['1F-R08', '1F-R09'],
    ['1F-R09', '1F-R10'],
    ['1F-R10', '1F-R11'],
    ['1F-R11', 'ref_bottom']
  ]
};

// Distance formula
function dist(n1, n2) {
  const dx = n1.x - n2.x;
  const dy = n1.y - n2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// Shortest path finder using Dijkstra
export function findShortestPath(graph, startNodeId, endNodeId) {
  if (!graph.nodes[startNodeId] || !graph.nodes[endNodeId]) {
    return null;
  }

  // Build adjacency list with edge weights
  const adj = {};
  for (const node in graph.nodes) {
    adj[node] = [];
  }
  for (const [u, v] of graph.edges) {
    if (graph.nodes[u] && graph.nodes[v]) {
      const d = dist(graph.nodes[u], graph.nodes[v]);
      adj[u].push({ node: v, weight: d });
      adj[v].push({ node: u, weight: d });
    }
  }

  const distances = {};
  const prev = {};
  const visited = new Set();
  const pq = [startNodeId];

  for (const node in graph.nodes) {
    distances[node] = Infinity;
  }
  distances[startNodeId] = 0;

  while (pq.length > 0) {
    pq.sort((a, b) => distances[a] - distances[b]);
    const curr = pq.shift();

    if (curr === endNodeId) break;
    if (visited.has(curr)) continue;
    visited.add(curr);

    for (const neighbor of adj[curr]) {
      if (visited.has(neighbor.node)) continue;
      const alt = distances[curr] + neighbor.weight;
      if (alt < distances[neighbor.node]) {
        distances[neighbor.node] = alt;
        prev[neighbor.node] = curr;
        pq.push(neighbor.node);
      }
    }
  }

  // Reconstruct path
  const path = [];
  let u = endNodeId;
  while (u) {
    path.unshift(u);
    u = prev[u];
  }

  if (path[0] !== startNodeId) {
    return null;
  }

  // Compute waypoint coordinates & directions
  const waypoints = path.map(id => ({
    id,
    ...graph.nodes[id]
  }));

  const instructions = generateDirections(waypoints);

  return {
    pathIds: path,
    waypoints,
    instructions,
    totalDistance: Math.round(distances[endNodeId])
  };
}

// Generate human-friendly turn-by-turn navigation instructions
function generateDirections(waypoints) {
  if (waypoints.length === 0) return [];
  const directions = [];

  for (let i = 0; i < waypoints.length; i++) {
    const curr = waypoints[i];
    const prev = i > 0 ? waypoints[i - 1] : null;
    const next = i < waypoints.length - 1 ? waypoints[i + 1] : null;

    if (i === 0) {
      directions.push({
        step: 1,
        text: `Start from ${curr.label}`,
        nodeId: curr.id,
        action: 'start'
      });
      continue;
    }

    if (i === waypoints.length - 1) {
      directions.push({
        step: directions.length + 1,
        text: `Arrived! Destination: ${curr.label}`,
        nodeId: curr.id,
        action: 'arrive'
      });
      continue;
    }

    // Determine direction angle
    const dx1 = curr.x - prev.x;
    const dy1 = curr.y - prev.y;
    const dx2 = next.x - curr.x;
    const dy2 = next.y - curr.y;

    const angle1 = Math.atan2(dy1, dx1);
    const angle2 = Math.atan2(dy2, dx2);
    let diff = angle2 - angle1;

    while (diff > Math.PI) diff -= 2 * Math.PI;
    while (diff < -Math.PI) diff += 2 * Math.PI;

    let turnText = '';
    let action = 'straight';

    if (diff > 0.45) {
      turnText = `Turn right at ${curr.label}`;
      action = 'right';
    } else if (diff < -0.45) {
      turnText = `Turn left at ${curr.label}`;
      action = 'left';
    } else {
      turnText = `Continue straight through ${curr.label}`;
      action = 'straight';
    }

    // Highlight key landmarks
    if (curr.id === 'staircase_gf' || curr.id === 'staircase_1f') {
      directions.push({
        step: directions.length + 1,
        text: `Reach the staircase and climb to the First Floor`,
        nodeId: curr.id,
        action: 'stairs'
      });
    } else if (curr.id === 'scanners_entry' || curr.id === 'scanners_exit') {
      directions.push({
        step: directions.length + 1,
        text: `Tap ID Card at Scanner Turnstiles and proceed forward`,
        nodeId: curr.id,
        action: 'scanner'
      });
    } else if (Math.abs(diff) > 0.45 || i % 2 === 0) {
      directions.push({
        step: directions.length + 1,
        text: turnText,
        nodeId: curr.id,
        action
      });
    }
  }

  return directions;
}

// Helper to map book floor and rack number to target node ID
export function getRackNodeId(floor, rackNumber) {
  const isFirstFloor = floor.includes('First') || floor === '1F';
  
  if (isFirstFloor) {
    if (rackNumber.includes('SC/ST') || rackNumber.includes('SCST')) {
      return rackNumber.includes('2') ? '1F-SCST-2' : '1F-SCST-1';
    }
    const match = rackNumber.match(/\d+/);
    if (match) {
      const num = parseInt(match[0], 10);
      return `1F-R${String(num).padStart(2, '0')}`;
    }
    return '1F-R01';
  } else {
    if (rackNumber.includes('Diploma')) return 'diploma_rack';
    if (rackNumber.includes('MBA')) return 'mba_rack';
    const match = rackNumber.match(/\d+/);
    if (match) {
      const num = parseInt(match[0], 10);
      return `GF-R${String(num).padStart(2, '0')}`;
    }
    return 'GF-R01';
  }
}
