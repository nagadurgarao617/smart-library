// Map data and layout definitions derived from the college library floor-map sketches

export const GROUND_FLOOR_LAYOUT = {
  id: 'GF',
  name: 'Ground Floor',
  width: 1000,
  height: 850,
  viewBox: '0 0 1000 850',

  entrance: {
    x: 20,
    y: 390,
    width: 25,
    height: 75,
    label: 'Main Entrance'
  },

  staffMemberTable: {
    x: 60,
    y: 480,
    width: 55,
    height: 40,
    label: 'Staff Member Table'
  },

  idScanners: [
    { id: 'scanner-1', x: 130, y: 380, width: 22, height: 38, label: 'ID Scanner 1' },
    { id: 'scanner-2', x: 130, y: 435, width: 22, height: 38, label: 'ID Scanner 2' }
  ],

  staffDesk: {
    // L-shaped staff desk
    horizontal: { x: 70, y: 610, width: 180, height: 35 },
    vertical: { x: 70, y: 645, width: 40, height: 70 },
    label: 'Staff Sitting Desk'
  },

  headRoom: {
    x: 65,
    y: 730,
    width: 175,
    height: 85,
    door: { x: 150, y: 730 },
    label: 'Head of Library Room'
  },

  digitalLibrary: {
    x: 50,
    y: 40,
    width: 230,
    height: 210,
    door: { x: 280, y: 145 },
    label: 'Digital Library',
    workstations: 8
  },

  staircase: {
    x: 300,
    y: 40,
    width: 130,
    height: 180,
    label: 'Staircase to 1st Floor',
    direction: 'UP'
  },

  newspaperStand: {
    x: 300,
    y: 385,
    width: 65,
    height: 60,
    label: 'Newspaper Stand'
  },

  studyTables: [
    // Upper pair
    { id: 'gf-st-1', x: 620, y: 55, width: 190, height: 26, label: 'Study Table 1' },
    { id: 'gf-st-2', x: 620, y: 105, width: 190, height: 26, label: 'Study Table 2' },
    // Center pair
    { id: 'gf-st-3', x: 620, y: 250, width: 150, height: 26, label: 'Study Table 3' },
    { id: 'gf-st-4', x: 620, y: 300, width: 150, height: 26, label: 'Study Table 4' }
  ],

  diplomaMbaRacks: [
    {
      id: 'GF-DIPLOMA',
      rack_number: 'Diploma Books Rack',
      rack_name: 'Diploma Books',
      category: 'Diploma',
      x: 470,
      y: 65,
      width: 105,
      height: 38,
      accessPoint: { x: 450, y: 84 }
    },
    {
      id: 'GF-MBA',
      rack_number: 'MBA Books Rack',
      rack_name: 'MBA Books',
      category: 'MBA',
      x: 470,
      y: 125,
      width: 105,
      height: 38,
      accessPoint: { x: 450, y: 144 }
    }
  ],

  // 20 Main Book Racks in 2 adjacent columns
  mainRacks: [
    // Column 1 (Racks 1 to 10)
    { id: 'GF-R10', num: 'Rack 10', name: 'Computer Science Engineering', x: 405, y: 430, w: 125, h: 26, col: 1, access: { x: 385, y: 443 } },
    { id: 'GF-R09', num: 'Rack 9', name: 'Computer Science Engineering', x: 405, y: 468, w: 125, h: 26, col: 1, access: { x: 385, y: 481 } },
    { id: 'GF-R08', num: 'Rack 8', name: 'Electronics and Communication Engineering', x: 405, y: 506, w: 125, h: 26, col: 1, access: { x: 385, y: 519 } },
    { id: 'GF-R07', num: 'Rack 7', name: 'Electronics and Communication Engineering', x: 405, y: 544, w: 125, h: 26, col: 1, access: { x: 385, y: 557 } },
    { id: 'GF-R06', num: 'Rack 6', name: 'Electrical Engineering', x: 405, y: 582, w: 125, h: 26, col: 1, access: { x: 385, y: 595 } },
    { id: 'GF-R05', num: 'Rack 5', name: 'Electrical Engineering', x: 405, y: 620, w: 125, h: 26, col: 1, access: { x: 385, y: 633 } },
    { id: 'GF-R04', num: 'Rack 4', name: 'Mechanical Engineering', x: 405, y: 658, w: 125, h: 26, col: 1, access: { x: 385, y: 671 } },
    { id: 'GF-R03', num: 'Rack 3', name: 'Mechanical Engineering', x: 405, y: 696, w: 125, h: 26, col: 1, access: { x: 385, y: 709 } },
    { id: 'GF-R02', num: 'Rack 2', name: 'Civil Engineering', x: 405, y: 734, w: 125, h: 26, col: 1, access: { x: 385, y: 747 } },
    { id: 'GF-R01', num: 'Rack 1', name: 'Civil Engineering', x: 405, y: 772, w: 125, h: 26, col: 1, access: { x: 385, y: 785 } },

    // Column 2 (Racks 11 to 20, adjacent to Column 1)
    { id: 'GF-R11', num: 'Rack 11', name: 'Artificial Intelligence and Machine Learning', x: 575, y: 430, w: 125, h: 26, col: 2, access: { x: 720, y: 443 } },
    { id: 'GF-R12', num: 'Rack 12', name: 'Artificial Intelligence and Machine Learning', x: 575, y: 468, w: 125, h: 26, col: 2, access: { x: 720, y: 481 } },
    { id: 'GF-R13', num: 'Rack 13', name: 'Artificial Intelligence', x: 575, y: 506, w: 125, h: 26, col: 2, access: { x: 720, y: 519 } },
    { id: 'GF-R14', num: 'Rack 14', name: 'Mathematics', x: 575, y: 544, w: 125, h: 26, col: 2, access: { x: 720, y: 557 } },
    { id: 'GF-R15', num: 'Rack 15', name: 'Mathematics', x: 575, y: 582, w: 125, h: 26, col: 2, access: { x: 720, y: 595 } },
    { id: 'GF-R16', num: 'Rack 16', name: 'Chemistry', x: 575, y: 620, w: 125, h: 26, col: 2, access: { x: 720, y: 633 } },
    { id: 'GF-R17', num: 'Rack 17', name: 'Physics', x: 575, y: 658, w: 125, h: 26, col: 2, access: { x: 720, y: 671 } },
    { id: 'GF-R18', num: 'Rack 18', name: 'English', x: 575, y: 696, w: 125, h: 26, col: 2, access: { x: 720, y: 709 } },
    { id: 'GF-R19', num: 'Rack 19', name: 'Competitive Examination Books', x: 575, y: 734, w: 125, h: 26, col: 2, access: { x: 720, y: 747 } },
    { id: 'GF-R20', num: 'Rack 20', name: 'General Reading', x: 575, y: 772, w: 125, h: 26, col: 2, access: { x: 720, y: 785 } }
  ]
};

export const FIRST_FLOOR_LAYOUT = {
  id: '1F',
  name: 'First Floor',
  width: 1000,
  height: 850,
  viewBox: '0 0 1000 850',

  staircase: {
    x: 300,
    y: 40,
    width: 130,
    height: 180,
    label: 'Staircase Landing',
    direction: 'DOWN'
  },

  laptopChargingBenches: [
    { id: 'lcb-1', x: 45, y: 75, width: 210, height: 28, label: 'Charging Bench 1' },
    { id: 'lcb-2', x: 45, y: 140, width: 210, height: 28, label: 'Charging Bench 2' },
    { id: 'lcb-3', x: 45, y: 205, width: 210, height: 28, label: 'Charging Bench 3' }
  ],

  projectWorkingRooms: [
    { id: 'pwr-1', x: 480, y: 35, width: 105, height: 165, label: 'Project Working Room 1', door: { x: 532, y: 200 } },
    { id: 'pwr-2', x: 605, y: 35, width: 105, height: 165, label: 'Project Working Room 2', door: { x: 657, y: 200 } },
    { id: 'pwr-3', x: 730, y: 35, width: 105, height: 165, label: 'Project Working Room 3', door: { x: 782, y: 200 } },
    { id: 'pwr-4', x: 855, y: 35, width: 105, height: 165, label: 'Project Working Room 4', door: { x: 907, y: 200 } }
  ],

  studyTables: [
    { id: '1f-st-1', x: 330, y: 360, width: 190, height: 28, label: 'Study Table 1' },
    { id: '1f-st-2', x: 330, y: 415, width: 190, height: 28, label: 'Study Table 2' }
  ],

  scstRacks: [
    {
      id: '1F-SCST-1',
      rack_number: 'SC/ST Books Rack 1',
      rack_name: 'SC/ST Books Rack 1',
      x: 330,
      y: 505,
      width: 130,
      height: 32,
      accessPoint: { x: 300, y: 521 }
    },
    {
      id: '1F-SCST-2',
      rack_number: 'SC/ST Books Rack 2',
      rack_name: 'SC/ST Books Rack 2',
      x: 330,
      y: 560,
      width: 130,
      height: 32,
      accessPoint: { x: 300, y: 576 }
    }
  ],

  // 11 Reference Racks on the RIGHT side
  referenceRacks: [
    { id: '1F-R01', num: 'Rack 1', name: 'Civil Engineering Reference Books', x: 660, y: 270, w: 190, h: 26, access: { x: 630, y: 283 } },
    { id: '1F-R02', num: 'Rack 2', name: 'Mechanical Engineering Reference Books', x: 660, y: 308, w: 190, h: 26, access: { x: 630, y: 321 } },
    { id: '1F-R03', num: 'Rack 3', name: 'Electrical Engineering Reference Books', x: 660, y: 346, w: 190, h: 26, access: { x: 630, y: 359 } },
    { id: '1F-R04', num: 'Rack 4', name: 'Electronics and Communication Reference Books', x: 660, y: 384, w: 190, h: 26, access: { x: 630, y: 397 } },
    { id: '1F-R05', num: 'Rack 5', name: 'Computer Science Reference Books', x: 660, y: 422, w: 190, h: 26, access: { x: 630, y: 435 } },
    { id: '1F-R06', num: 'Rack 6', name: 'AI and ML Reference Books', x: 660, y: 460, w: 190, h: 26, access: { x: 630, y: 473 } },
    { id: '1F-R07', num: 'Rack 7', name: 'Artificial Intelligence Reference Books', x: 660, y: 498, w: 190, h: 26, access: { x: 630, y: 511 } },
    { id: '1F-R08', num: 'Rack 8', name: 'Mathematics Reference Books', x: 660, y: 536, w: 190, h: 26, access: { x: 630, y: 549 } },
    { id: '1F-R09', num: 'Rack 9', name: 'Chemistry Reference Books', x: 660, y: 574, w: 190, h: 26, access: { x: 630, y: 587 } },
    { id: '1F-R10', num: 'Rack 10', name: 'Physics Reference Books', x: 660, y: 612, w: 190, h: 26, access: { x: 630, y: 625 } },
    { id: '1F-R11', num: 'Rack 11', name: 'English Reference Books', x: 660, y: 650, w: 190, h: 26, access: { x: 630, y: 663 } }
  ]
};
