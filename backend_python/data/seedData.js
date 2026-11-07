// seedData.js - Contains all books transcribed from the college library catalog
const groundFloorBooks = [
  // RACK 01 - Civil Engineering (B Section & A Section)
  ...[
    "Structural Analysis", "Structural Analysis – I", "Matrix Methods of Structural Analysis",
    "Basic Structural Analysis", "Advanced Structural Analysis", "Analysis of Structures",
    "Structural Dynamics", "Analysis of Structures – Volume I, II", "Mechanics of Structures",
    "Theory of Structures", "Design of Steel Structures", "Structural Design in Steel – I, II",
    "Steel Structures", "Structural Design and Drawing", "Reinforced Concrete Structures – Volume I, II",
    "Advanced R.C.C. Design", "Limit State Design of Reinforced Concrete", "Essentials of Bridge Engineering",
    "Design of Bridges", "Railway Engineering", "Highway Engineering",
    "Principles, Practice and Design of Highway Engineering", "Principles and Practices of Highway Engineering",
    "Highway and Traffic Engineering", "Traffic and Highway Engineering",
    "Highway, Railway, Airport and Harbour Engineering", "Pavement Design", "Pavement Analysis and Design",
    "Flow in Open Channels", "Flow Through Open Channels"
  ].map((title, i) => ({
    title,
    author: ["B.C. Punmia", "S. Ramamrutham", "S.K. Duggal", "V.N. Vazirani", "Devdas Menon", "G.S. Pandit"][i % 6],
    subject: "Civil Engineering",
    department: "Civil Engineering",
    floor: "Ground Floor",
    rack_number: "Rack 1",
    rack_name: "Civil Engineering",
    shelf_number: Math.floor(i / 6) + 1,
    position: `Section B - Shelf ${Math.floor(i / 6) + 1} - Pos ${(i % 6) + 1}`,
    availability_status: i % 7 === 0 ? "Issued" : "Available",
    is_sample: 0
  })),

  ...[
    "Watershed Management", "Ground Water Assessment, Development and Management", "Disaster Management",
    "Disaster Science and Management", "Environmental Impact Assessment Methodologies",
    "Environmental Science and Engineering", "Environmental Engineering and Management",
    "Surveying – Volume I, II, III", "Plane Surveying", "Higher Surveying", "Advanced Surveying",
    "Theory of Elasticity", "Theory of Elastic Stability", "Theory of Plates and Shells",
    "Engineering Hydrology", "Hydrology", "Hydrology and Water Resources Engineering",
    "Groundwater Hydrology", "Ground Water", "Properties of Concrete", "Concrete Technology",
    "Concrete Microstructure, Properties and Materials", "Prestressed Concrete Structures",
    "Estimating and Costing", "Estimating and Costing in Civil Engineering",
    "Civil Engineering Contracts and Estimates", "Foundation Analysis and Design", "Foundation Engineering",
    "Theory and Practice of Foundation Design", "Engineering Geology", "Geotechnical Engineering",
    "Ground Improvement Techniques", "Soil Mechanics and Foundations", "Soil Mechanics",
    "An Introduction to Soil Reinforcement and Geosynthetics", "Earthquake Resistant Design of Structures",
    "Fundamentals of Soil Dynamics and Earthquake Engineering", "Earthquake Resistant Design and Risk Reduction",
    "Earthquake-Resistant Design of Building Structures", "Dynamics of Structures",
    "Rehabilitation of Concrete Structure", "Design of Prestressed Concrete Structures"
  ].map((title, i) => ({
    title,
    author: ["K.R. Arora", "M.S. Shetty", "P. Dayaratnam", "Joseph E. Bowles", "K. Subramanya", "D.K. Todd"][i % 6],
    subject: "Civil Engineering",
    department: "Civil Engineering",
    floor: "Ground Floor",
    rack_number: "Rack 1",
    rack_name: "Civil Engineering",
    shelf_number: Math.floor(i / 9) + 1,
    position: `Section A - Shelf ${Math.floor(i / 9) + 1} - Pos ${(i % 9) + 1}`,
    availability_status: i % 8 === 0 ? "Issued" : "Available",
    is_sample: 0
  })),

  // RACK 02 - Civil Engineering
  ...[
    "Engineering Optimization", "Optimization", "Engineering Optimization Theory and Practice",
    "Statistical Quality Control", "Mechanical Vibration", "Elements of Mechanical Vibration",
    "Engineering Metrology", "Dimensional Metrology", "Engineering Drawing", "Engineering Graphics",
    "Engineering Drawing (Plane and Solid Geometry)", "Engineering Drawing with AutoCAD",
    "Mechanical Engineering", "Basic Mechanical Engineering", "Basic Civil and Mechanical Engineering",
    "Finite Element Methods", "Finite Element Analysis", "The Finite Element Method for Engineers",
    "Engineering Design", "Mechanical Measurements", "Mechanical Measurements and Control", "Strength of Materials"
  ].map((title, i) => ({
    title,
    author: ["S.S. Rao", "N.D. Bhatt", "R.K. Rajput", "J.N. Reddy", "Thomas J.R. Hughes", "K.L. Narayana"][i % 6],
    subject: "Civil Engineering",
    department: "Civil Engineering",
    floor: "Ground Floor",
    rack_number: "Rack 2",
    rack_name: "Civil Engineering",
    shelf_number: Math.floor(i / 5) + 1,
    position: `Section B - Shelf ${Math.floor(i / 5) + 1} - Pos ${(i % 5) + 1}`,
    availability_status: "Available",
    is_sample: 0
  })),

  ...[
    "Water Resources Engineering", "Irrigation and Water Resources Engineering", "Irrigation Engineering",
    "Irrigation Engineering and Hydraulic Structures", "Irrigation Water Management and Water Power Engineering",
    "Irrigation and Water Power Engineering", "Environmental Engineering", "Water Supply Engineering",
    "Water Supply and Sanitary Engineering", "Wastewater Treatment", "Water and Wastewater Technology",
    "Environmental Engineering – I", "Wastewater Engineering", "Sewage Disposal and Air Pollution Engineering",
    "Sewage Treatment and Disposal of Waste Water", "Engineering", "Land and Water Resources Engineering",
    "Transportation Engineering", "Transportation Engineering and Planning",
    "Traffic Engineering and Transportation Planning", "Construction Planning and Technology",
    "Construction Project Management", "Design and Construction of Concrete Roads", "PERT and CPM",
    "Project Planning and Control with PERT and CPM", "Maintenance and Repair of Civil Structures",
    "Construction Repair and Maintenance", "Building Materials", "Building Materials, Construction and Planning",
    "Building Materials and Construction", "Building Construction", "Building Planning and Drawing",
    "Building Planning, Designing and Scheduling", "Remote Sensing and GIS",
    "Remote Sensing and GIS Applications", "Remote Sensing and Image Interpretation"
  ].map((title, i) => ({
    title,
    author: ["S.K. Garg", "P.N. Modi", "Metcalf & Eddy", "C.S. Rao", "L.R. Kadiyali", "K.K. Chitkara"][i % 6],
    subject: "Civil Engineering",
    department: "Civil Engineering",
    floor: "Ground Floor",
    rack_number: "Rack 2",
    rack_name: "Civil Engineering",
    shelf_number: Math.floor(i / 7) + 1,
    position: `Section A - Shelf ${Math.floor(i / 7) + 1} - Pos ${(i % 7) + 1}`,
    availability_status: i % 9 === 0 ? "Issued" : "Available",
    is_sample: 0
  })),

  // RACK 03 - Mechanical Engineering
  ...[
    "Basic Engineering Thermodynamics", "Applied Thermodynamics", "Fundamentals of Engineering Thermodynamics",
    "Thermodynamics", "Engineering Thermodynamics", "Internal Combustion Engines", "Gas Turbines",
    "Heat and Mass Transfer", "Fundamentals of Engineering Heat and Mass Transfer", "Mass Transfer",
    "Heat Transfer", "Design of Machine Elements", "Machine Drawing", "Design Data Hand Book",
    "Machine Design", "Mechanism and Machine Theory", "Theory of Machines and Mechanisms"
  ].map((title, i) => ({
    title,
    author: ["P.K. Nag", "V. Ganesan", "Y.A. Cengel", "R.K. Rajput", "J.P. Holman", "V.B. Bhandari"][i % 6],
    subject: "Mechanical Engineering",
    department: "Mechanical Engineering",
    floor: "Ground Floor",
    rack_number: "Rack 3",
    rack_name: "Mechanical Engineering",
    shelf_number: Math.floor(i / 4) + 1,
    position: `Section B - Shelf ${Math.floor(i / 4) + 1} - Pos ${(i % 4) + 1}`,
    availability_status: "Available",
    is_sample: 0
  })),

  ...[
    "Engineering Mechanics", "Engineering Mechanics – Statics", "Engineering Mechanics – Dynamics",
    "Engineering Mechanics – Statics and Dynamics", "Mechanics of Solids", "Computational Fluid Dynamics",
    "Fluid Mechanics", "Fluid Mechanics and Hydraulic Machines", "Fluid Mechanics and Fluid Power Engineering",
    "Material Science and Engineering", "Material Science and Metallurgy", "Mechanics of Materials",
    "Mechanical Behaviour of Materials", "Mechanical Metallurgy", "Nano-Technology", "Mechatronics",
    "Mechatronics in Integrated Mechanical Engineering", "Mechatronics System Design",
    "Power Plant Engineering", "MEMS", "MEMS and Microsystems Design and Manufacturing",
    "Thermal Engineering", "Thermal Engineering Data Handbook"
  ].map((title, i) => ({
    title,
    author: ["S. Timoshenko", "J.L. Meriam", "F.M. White", "R.K. Bansal", "William D. Callister", "G.E. Dieter"][i % 6],
    subject: "Mechanical Engineering",
    department: "Mechanical Engineering",
    floor: "Ground Floor",
    rack_number: "Rack 3",
    rack_name: "Mechanical Engineering",
    shelf_number: Math.floor(i / 5) + 1,
    position: `Section A - Shelf ${Math.floor(i / 5) + 1} - Pos ${(i % 5) + 1}`,
    availability_status: i % 8 === 0 ? "Issued" : "Available",
    is_sample: 0
  })),

  // RACK 04 - Mechanical Engineering
  ...[
    "Theory of Machines and Mechanisms", "Production Technology", "CAD/CAM Theory and Practice",
    "Refrigeration and Air Conditioning", "Advanced Machining Processes", "CAD/CAM/CAE", "CAD/CAM",
    "Machine Tools", "CAD/CAM/CIM", "Jigs and Fixtures", "CAD/CAM Computer-Aided Design and Manufacturing",
    "Hydraulics and Pneumatics", "Automobile Engineering", "Rapid Prototyping", "Robotics",
    "Industrial Robotics", "Robotics and Control", "Manufacturing Science",
    "Elements of Production Planning and Control", "Production Systems", "Automation",
    "Computer-Integrated Manufacturing", "Physical Metallurgy", "Manufacturing Technology", "Workshop Technology"
  ].map((title, i) => ({
    title,
    author: ["P.C. Sharma", "Mikell P. Groover", "Ibrahim Zeid", "Kirpal Singh", "Amitabha Ghosh", "R.K. Jain"][i % 6],
    subject: "Mechanical Engineering",
    department: "Mechanical Engineering",
    floor: "Ground Floor",
    rack_number: "Rack 4",
    rack_name: "Mechanical Engineering",
    shelf_number: Math.floor(i / 5) + 1,
    position: `Section B - Shelf ${Math.floor(i / 5) + 1} - Pos ${(i % 5) + 1}`,
    availability_status: "Available",
    is_sample: 0
  })),

  // RACK 05 - Electrical Engineering
  ...[
    "Theory and Practice of Electrical Machines", "Electrical Machines", "Renewable Energy",
    "Special Electrical Machines", "Non-Conventional Energy Resources", "Non-Conventional Energy Sources",
    "Wind Electrical Systems", "Solar Energy", "Theory of Alternating Current Machines", "Transformers",
    "Basic Electrical and Electronics", "Basic Electrical Engineering", "Basic Electrical Engineering and Electronics",
    "Electrical Technology – I, II, III, IV", "Fundamentals of Electrical Engineering", "Power System",
    "Power Electronics", "Motor Drives", "Electrical Power Systems", "Electrical Power",
    "Elements of Power System", "Electrical Motor Drives", "Modeling of Power System Components",
    "Modern Power Electronics", "Power System Analysis and Design", "Industrial and Power Electronics",
    "Power System Restructuring and Deregulation", "Power System Protection", "Power System Analysis, Operation and Control",
    "Switchgear", "Protection and Switchgear", "Power System Operation and Control", "Power Quality",
    "Power System Stability", "Science of Utilisation of Electrical Energy", "Utilization of Electric Power",
    "Traction", "Power System Stability and Control", "Electrical Power Systems and Electric Power", "Understanding FACTS"
  ].map((title, i) => ({
    title,
    author: ["I.J. Nagrath", "D.P. Kothari", "P.S. Bimbhra", "B.L. Theraja", "M.G. Say", "C.L. Wadhwa"][i % 6],
    subject: "Electrical Engineering",
    department: "Electrical & Electronics Engineering",
    floor: "Ground Floor",
    rack_number: "Rack 5",
    rack_name: "Electrical Engineering",
    shelf_number: Math.floor(i / 8) + 1,
    position: `Section B - Shelf ${Math.floor(i / 8) + 1} - Pos ${(i % 8) + 1}`,
    availability_status: i % 10 === 0 ? "Issued" : "Available",
    is_sample: 0
  })),

  // RACK 06 - Electrical Engineering
  ...[
    "HVDC Transmission", "HVDC Power Transmission Systems", "HVDC Transmission and Distribution Engineering",
    "HVDC Transmission and Distribution", "Electromagnetic Waves", "Electromagnetism", "Electromagnetic Fields",
    "Electromagnetic Field Theory", "Engineering Electromagnetics", "Network Analysis",
    "Engineering Network Analysis and Filter Design", "Medical Instrumentation", "Biomedical Instrumentation",
    "Biomedical Instrumentation and Measurements", "Network Theory", "Engineering Circuit Analysis",
    "Electric Circuits", "Circuit Theory", "Electromagnetic Waves and Transmission Lines",
    "Electromagnetic Theory and Transmission Lines", "Transmission Lines and Networks"
  ].map((title, i) => ({
    title,
    author: ["K.R. Padiyar", "William H. Hayt", "M.E. Van Valkenburg", "Leslie Cromwell", "John D. Ryder", "Matthew N.O. Sadiku"][i % 6],
    subject: "Electrical Engineering",
    department: "Electrical & Electronics Engineering",
    floor: "Ground Floor",
    rack_number: "Rack 6",
    rack_name: "Electrical Engineering",
    shelf_number: Math.floor(i / 5) + 1,
    position: `Section B - Shelf ${Math.floor(i / 5) + 1} - Pos ${(i % 5) + 1}`,
    availability_status: "Available",
    is_sample: 0
  })),

  ...[
    "Electric Power Distribution System", "Electric Power Transmission",
    "Electric Power Generation, Transmission and Distribution", "Electric Power Distribution",
    "Digital Image Processing", "Digital Image Processing Using MATLAB", "Image Processing, Analysis and Machine Vision",
    "Image Processing and Analysis", "Electrical Measurements", "Electrical Measurements and Measuring Instruments",
    "Electrical Instrumentation", "Transducers and Instrumentation", "Electronic Instrumentation",
    "Modern Electronic Instrumentation", "Measurement Techniques", "Protective Relays", "Microwave Engineering",
    "Microwave Devices and Circuits", "Microwave Circuits and Passive Devices", "Radar Engineering",
    "Electric and Hybrid Vehicles", "Electric Vehicle Battery Systems",
    "Modern Electric, Hybrid Electric and Fuel Cell Vehicles", "Electrical Vehicle Technology",
    "SPICE for Circuits and Electronics Using PSPICE"
  ].map((title, i) => ({
    title,
    author: ["A.K. Sawhney", "Rafael C. Gonzalez", "David M. Pozar", "Merrill I. Skolnik", "Mehrdad Ehsani", "Muhammad H. Rashid"][i % 6],
    subject: "Electrical Engineering",
    department: "Electrical & Electronics Engineering",
    floor: "Ground Floor",
    rack_number: "Rack 6",
    rack_name: "Electrical Engineering",
    shelf_number: Math.floor(i / 5) + 1,
    position: `Section A - Shelf ${Math.floor(i / 5) + 1} - Pos ${(i % 5) + 1}`,
    availability_status: i % 7 === 0 ? "Issued" : "Available",
    is_sample: 0
  })),

  // RACK 07 - Electronics and Communication Engineering
  ...[
    "Digital Signal Processing", "Discrete-Time Signal Processing", "Digital Signal Processing Using MATLAB",
    "Basic Electronics", "Industrial Electronics", "Microelectronic Circuits", "Basic Electronics and Linear Circuits",
    "Electronic Devices and Circuits", "Electronic Devices and Circuit Theory", "Semiconductor Devices and Circuits",
    "Basics of Electronic Devices", "Advanced Electronic Communications Systems", "Electronics Circuits and Analysis",
    "Electronic Circuit Analysis", "Analog Communications Systems", "Analog Communications",
    "Digital and Analog Communications", "Electronic Circuits and Systems", "Integrated Electronics",
    "Linear IC Applications", "Linear Integrated Circuits", "Amplifiers and Linear ICs",
    "Modern Digital and Linear Integrated Circuits", "Digital Circuits", "Pulse and Digital Circuits",
    "Pulse, Switching and Digital Circuits", "Pulse Digital Circuits and Computer", "Signals and Systems",
    "Signal Processing", "Statistical Signal Processing and Modeling"
  ].map((title, i) => ({
    title,
    author: ["Alan V. Oppenheim", "Adel S. Sedra", "Robert L. Boylestad", "Jacob Millman", "D. Roy Choudhury", "A. Anand Kumar"][i % 6],
    subject: "Electronics and Communication Engineering",
    department: "Electronics & Communication Engineering",
    floor: "Ground Floor",
    rack_number: "Rack 7",
    rack_name: "Electronics and Communication Engineering",
    shelf_number: Math.floor(i / 6) + 1,
    position: `Section B - Shelf ${Math.floor(i / 6) + 1} - Pos ${(i % 6) + 1}`,
    availability_status: "Available",
    is_sample: 0
  })),

  ...[
    "Communication Systems", "Principles of Communication Systems", "Communication Systems Engineering",
    "Electronic Communication Systems", "Digital Communications", "Analog and Digital Communications",
    "Digital Communication Systems", "Telecommunication Switching, Traffic and Networks",
    "Signal Processing and Applications", "Signals, Systems and Transforms", "Antennas",
    "Antenna and Wave Propagation", "Fiber-Optic Communications", "Fiber-Optic Communication",
    "Wireless Communications", "Modern Wireless Communication", "Mobile Communications", "Cellular Telephones"
  ].map((title, i) => ({
    title,
    author: ["Simon Haykin", "Herbert Taub", "John G. Proakis", "Wayne Tomasi", "Constantine A. Balanis", "Gerd Keiser"][i % 6],
    subject: "Electronics and Communication Engineering",
    department: "Electronics & Communication Engineering",
    floor: "Ground Floor",
    rack_number: "Rack 7",
    rack_name: "Electronics and Communication Engineering",
    shelf_number: Math.floor(i / 4) + 1,
    position: `Section A - Shelf ${Math.floor(i / 4) + 1} - Pos ${(i % 4) + 1}`,
    availability_status: i % 6 === 0 ? "Issued" : "Available",
    is_sample: 0
  })),

  // RACK 08 - Electronics and Communication Engineering
  ...[
    "Satellite Communications", "Satellite Communication", "Control Systems", "Control System Analysis and Design",
    "Feedback and Control Systems", "Automatic Control Systems", "Modern Control Engineering",
    "Modern Control System Theory", "Digital Control and State Variable Methods", "Digital Control Systems",
    "Control of Dynamic Systems", "Discrete-Time Control Systems", "Digital Systems", "Digital Computer Design",
    "Digital Logic Design", "Switching Theory and Logic Design", "Logic Design", "Digital Integrated Circuits",
    "VLSI Circuit Design", "VLSI Design", "VLSI Physical Design", "VLSI Design and Test"
  ].map((title, i) => ({
    title,
    author: ["Katsuhiko Ogata", "Norman S. Nise", "M. Gopal", "M. Morris Mano", "Sung-Mo Kang", "Neil H.E. Weste"][i % 6],
    subject: "Electronics and Communication Engineering",
    department: "Electronics & Communication Engineering",
    floor: "Ground Floor",
    rack_number: "Rack 8",
    rack_name: "Electronics and Communication Engineering",
    shelf_number: Math.floor(i / 5) + 1,
    position: `Section B - Shelf ${Math.floor(i / 5) + 1} - Pos ${(i % 5) + 1}`,
    availability_status: "Available",
    is_sample: 0
  })),

  // RACK 09 - Computer Science Engineering
  ...[
    "Computers and Commonsense", "Computers and Information Technology", "Distributed and Cloud Computing",
    "Cloud Computing", "Embedded Microcomputer Systems", "Embedded System Design", "Internet of Things",
    "Internet of Things Architecture and Design", "IoT Fundamentals", "Embedded Real-Time Systems Programming",
    "Embedded Microcontrollers", "Microprocessors and Interfacing", "Algorithms", "Computer Algorithms",
    "Design and Analysis of Algorithms", "Design and Analysis of Computer Algorithms", "Software Engineering",
    "Software Engineering Principles and Practice", "Object-Oriented Software Engineering", "Software Design Methodology",
    "Software Architecture", "Software Project Management", "Designing the User Interface", "User Interface Design",
    "Human Computer Interface", "Applying UML and Patterns", "UML Distilled", "The Unified Modeling Language",
    "Design Patterns", "Computer Components", "Systems Analysis and Design", "Advanced Computer Architecture",
    "Computer Organization", "Computer Architecture and Parallel Processing", "Computer Organization and Architecture",
    "Automata Theory, Formal Languages and Computation", "Theory of Computation", "Automata and Languages",
    "Formal Language and Automata Theory", "Hadoop for Dummies", "Hadoop MapReduce"
  ].map((title, i) => ({
    title,
    author: ["Thomas H. Cormen", "Roger S. Pressman", "Erich Gamma", "William Stallings", "John E. Hopcroft", "Douglas E. Comer"][i % 6],
    subject: "Computer Science Engineering",
    department: "Computer Science & Engineering",
    floor: "Ground Floor",
    rack_number: "Rack 9",
    rack_name: "Computer Science Engineering",
    shelf_number: Math.floor(i / 8) + 1,
    position: `Section B - Shelf ${Math.floor(i / 8) + 1} - Pos ${(i % 8) + 1}`,
    availability_status: i % 9 === 0 ? "Issued" : "Available",
    is_sample: 0
  })),

  // RACK 10 - Computer Science Engineering
  ...[
    "Programming in ANSI C", "Programming in C", "Programming and Data Structures", "Data Structures with C",
    "Data Structures", "Data Structures and Algorithms", "Programming in C++", "Object-Oriented Programming",
    "UNIX and UNIX Programming", "UNIX Programming Environment", "UNIX Network Programming",
    "Operating Systems", "Modern Operating Systems", "Distributed Operating Systems", "Java Programming",
    "Java Servlets", "Big Java", "Java and COBOL", "Advanced Java Programming", "Linux Kernel Programming",
    "Linux", "Linux Programming", "Distributed Computing", "Distributed Systems", "Compilers",
    "Compiler Design", "Python", "Python Programming", "Mobile Computing", "Database Management Systems",
    "Database Systems", "Database Technology"
  ].map((title, i) => ({
    title,
    author: ["E. Balagurusamy", "Andrew S. Tanenbaum", "Abraham Silberschatz", "Bjarne Stroustrup", "Alfred V. Aho", "W. Richard Stevens"][i % 6],
    subject: "Computer Science Engineering",
    department: "Computer Science & Engineering",
    floor: "Ground Floor",
    rack_number: "Rack 10",
    rack_name: "Computer Science Engineering",
    shelf_number: Math.floor(i / 6) + 1,
    position: `Section B - Shelf ${Math.floor(i / 6) + 1} - Pos ${(i % 6) + 1}`,
    availability_status: i % 8 === 0 ? "Issued" : "Available",
    is_sample: 0
  })),

  // RACK 11 - Artificial Intelligence and Machine Learning
  ...[
    "DEVOPS Automation Cookbook", "DEVOPS: A Software Architect's Handbook", "Lean DEVOPS",
    "Real-World DEVOPS Practices", "DEVOPS Handbook", "Ultimate Data Engineering", "Data Engineering Fundamentals",
    "Data Mining", "Data Mining Techniques", "Reinforcement Learning", "Hack Proofing", "Hacking", "Ethical Hacking",
    "Information Security", "Cyber Security", "Network Security", "Cryptography", "Cryptography and Security",
    "Cryptography and Network Security", "Deep Learning", "Deep Learning with Python", "Learning Deep Learning",
    "Generative Deep Learning", "Generative AI with Python", "Machine Learning", "Applied Machine Learning",
    "Machine Learning with Python"
  ].map((title, i) => ({
    title,
    author: ["Ian Goodfellow", "Francois Chollet", "Aurélien Géron", "Stuart Russell", "Richard S. Sutton", "Jiawei Han"][i % 6],
    subject: "Artificial Intelligence and Machine Learning",
    department: "AI & ML",
    floor: "Ground Floor",
    rack_number: "Rack 11",
    rack_name: "Artificial Intelligence and Machine Learning",
    shelf_number: Math.floor(i / 6) + 1,
    position: `Section B - Shelf ${Math.floor(i / 6) + 1} - Pos ${(i % 6) + 1}`,
    availability_status: i % 7 === 0 ? "Issued" : "Available",
    is_sample: 0
  })),

  // RACK 12 - Artificial Intelligence and Machine Learning
  ...[
    "Neural Networks", "Fuzzy Logic and Neural Networks", "Soft Computing", "Recommender Systems",
    "Speech and Language Processing", "Natural Language Processing", "Natural Language Processing and Information Retrieval",
    "Data Science", "Data Science and Analytics", "Data Science from Scratch", "Data Science with Jupyter",
    "Large Language Models", "Generative AI", "Data Analytics and Visualization", "Generative AI for Everyone",
    "Generative AI Techniques and Applications", "Data Science Concepts and Practice",
    "Data Science and Machine Learning Using Python"
  ].map((title, i) => ({
    title,
    author: ["Christopher M. Bishop", "Daniel Jurafsky", "Joel Grus", "Simon Haykin", "S. Rajasekaran", "Vijay Kotu"][i % 6],
    subject: "Artificial Intelligence and Machine Learning",
    department: "AI & ML",
    floor: "Ground Floor",
    rack_number: "Rack 12",
    rack_name: "Artificial Intelligence and Machine Learning",
    shelf_number: Math.floor(i / 4) + 1,
    position: `Section B - Shelf ${Math.floor(i / 4) + 1} - Pos ${(i % 4) + 1}`,
    availability_status: "Available",
    is_sample: 0
  })),

  ...[
    "Big Data and Analytics", "Big Data", "Math for Data Science", "Data Science", "Data Analytics"
  ].map((title, i) => ({
    title,
    author: ["Seema Acharya", "Subhashini Chellappan", "Hadley Wickham", "Wes McKinney", "Gilbert Strang"][i % 5],
    subject: "Artificial Intelligence and Machine Learning",
    department: "AI & ML",
    floor: "Ground Floor",
    rack_number: "Rack 12",
    rack_name: "Artificial Intelligence and Machine Learning",
    shelf_number: 5,
    position: `Section A - Shelf 5 - Pos ${i + 1}`,
    availability_status: "Available",
    is_sample: 0
  })),

  // RACK 13 - Artificial Intelligence
  ...[
    "Computer Graphics", "Computer Graphics Using OpenGL", "Mathematical Elements for Computer Graphics",
    "Procedural Elements for Computer Graphics", "Multimedia Applications", "Multimedia Communications",
    "Flash MX", "Multimedia Databases", "Multimedia in Action"
  ].map((title, i) => ({
    title,
    author: ["Donald Hearn", "M. Pauline Baker", "David F. Rogers", "Ralf Steinmetz", "Fred Halsall", "Prabhat K. Andleigh"][i % 6],
    subject: "Artificial Intelligence",
    department: "Artificial Intelligence",
    floor: "Ground Floor",
    rack_number: "Rack 13",
    rack_name: "Artificial Intelligence",
    shelf_number: Math.floor(i / 3) + 1,
    position: `Section B - Shelf ${Math.floor(i / 3) + 1} - Pos ${(i % 3) + 1}`,
    availability_status: "Available",
    is_sample: 0
  })),

  ...[
    "Hyper Text Markup Language", "Web Technologies", "Web Programming", "Web Programming with HTML",
    "Programming with World Wide Web", "Frontiers of Electronic Commerce"
  ].map((title, i) => ({
    title,
    author: ["Robert W. Sebesta", "Uttam K. Roy", "Ravi Kalakota", "Chris Bates", "Jon Duckett", "Deitel & Deitel"][i % 6],
    subject: "Artificial Intelligence",
    department: "Artificial Intelligence",
    floor: "Ground Floor",
    rack_number: "Rack 13",
    rack_name: "Artificial Intelligence",
    shelf_number: 4,
    position: `Section A - Shelf 4 - Pos ${i + 1}`,
    availability_status: "Available",
    is_sample: 0
  })),

  // RACK 14 - Mathematics
  ...[
    "Engineering Mathematics", "Advanced Engineering Mathematics", "Engineering Mathematics – Volume I",
    "Engineering Mathematics – Volume II", "Engineering Mathematics – Volume III",
    "Engineering Mathematics MATLAB", "Mathematical Methods"
  ].map((title, i) => ({
    title,
    author: ["Erwin Kreyszig", "B.S. Grewal", "H.K. Dass", "N.P. Bali", "B.V. Ramana", "Srimanta Pal"][i % 6],
    subject: "Mathematics",
    department: "Basic Sciences & Humanities",
    floor: "Ground Floor",
    rack_number: "Rack 14",
    rack_name: "Mathematics",
    shelf_number: Math.floor(i / 2) + 1,
    position: `Section B - Shelf ${Math.floor(i / 2) + 1} - Pos ${(i % 2) + 1}`,
    availability_status: "Available",
    is_sample: 0
  })),

  // RACK 15 - Mathematics
  ...[
    "Differential Calculus", "Differential Equation and Vector Calculus", "Mathematical Methods",
    "Special Functions and Complex Variables", "Discrete Mathematical Structures", "Numerical Analysis",
    "Linear Algebra and Calculus", "Complex Variables and Statistical Methods",
    "Mathematical Foundations of Computer Science", "Discrete Mathematics"
  ].map((title, i) => ({
    title,
    author: ["Shanti Narayan", "Kenneth H. Rosen", "Richard L. Burden", "J.P. Tremblay", "Gilbert Strang", "P. Kandasamy"][i % 6],
    subject: "Mathematics",
    department: "Basic Sciences & Humanities",
    floor: "Ground Floor",
    rack_number: "Rack 15",
    rack_name: "Mathematics",
    shelf_number: Math.floor(i / 3) + 1,
    position: `Section B - Shelf ${Math.floor(i / 3) + 1} - Pos ${(i % 3) + 1}`,
    availability_status: "Available",
    is_sample: 0
  })),

  // RACK 16 - Chemistry
  ...[
    "Applied Chemistry", "Concise Inorganic Chemistry", "Engineering Chemistry",
    "Engineering Chemistry – Volume I and II", "Engineering Chemistry (with Laboratory Experiments)"
  ].map((title, i) => ({
    title,
    author: ["J.D. Lee", "P.C. Jain", "Monica Jain", "Shashi Chawla", "O.G. Palanna"][i % 5],
    subject: "Chemistry",
    department: "Basic Sciences & Humanities",
    floor: "Ground Floor",
    rack_number: "Rack 16",
    rack_name: "Chemistry",
    shelf_number: 1,
    position: `Section B - Shelf 1 - Pos ${i + 1}`,
    availability_status: "Available",
    is_sample: 0
  })),

  ...[
    "Probability and Statistics", "Statistics", "Probability Theory – Stochastic Processes",
    "Probability Theory – Random Processes"
  ].map((title, i) => ({
    title,
    author: ["S.C. Gupta", "V.K. Kapoor", "A. Papoulis", "Sheldon M. Ross"][i % 4],
    subject: "Chemistry & Statistics",
    department: "Basic Sciences & Humanities",
    floor: "Ground Floor",
    rack_number: "Rack 16",
    rack_name: "Chemistry",
    shelf_number: 2,
    position: `Section A - Shelf 2 - Pos ${i + 1}`,
    availability_status: "Available",
    is_sample: 0
  })),

  // RACK 17 - Physics (Sample College Physics Library Collection)
  ...[
    "Engineering Physics", "Applied Physics", "Modern Physics", "Optics and Spectroscopy",
    "Solid State Physics", "Quantum Mechanics for Engineers", "Fiber Optics and Lasers",
    "Electricity and Magnetism", "Nanomaterials and Nanotechnology", "Semiconductor Physics"
  ].map((title, i) => ({
    title,
    author: ["M.N. Avadhanulu", "P.G. Kshirsagar", "Arthur Beiser", "Ajoy Ghatak", "Charles Kittel", "David J. Griffiths"][i % 6],
    subject: "Physics",
    department: "Basic Sciences & Humanities",
    floor: "Ground Floor",
    rack_number: "Rack 17",
    rack_name: "Physics",
    shelf_number: Math.floor(i / 3) + 1,
    position: `Section B - Shelf ${Math.floor(i / 3) + 1} - Pos ${(i % 3) + 1}`,
    availability_status: "Available",
    is_sample: 1
  })),

  // RACK 18 - English
  ...[
    "English for Engineers and Technologists", "English for Professionals", "Speak in English",
    "English Phonetics for Indian Students", "General English", "Objective English for Competitive Exams",
    "Advanced Communicative English", "English Vocabulary", "Communication Skills", "English Grammar",
    "English Essentials", "English Encounters", "English for Technical Communication",
    "Pathfinder Communicative English", "Skill Craft: A Communicative English"
  ].map((title, i) => ({
    title,
    author: ["Raymond Murphy", "Wren & Martin", "T. Balasubramanian", "Meenakshi Raman", "Sangeeta Sharma", "K.R. Lakshminarayanan"][i % 6],
    subject: "English",
    department: "Basic Sciences & Humanities",
    floor: "Ground Floor",
    rack_number: "Rack 18",
    rack_name: "English",
    shelf_number: Math.floor(i / 4) + 1,
    position: `Section B - Shelf ${Math.floor(i / 4) + 1} - Pos ${(i % 4) + 1}`,
    availability_status: "Available",
    is_sample: 0
  })),

  ...[
    "Human Values of Professional Ethics", "Professional Ethics and Human Values", "Professional Ethics and Morals",
    "Indian Culture and Values of Professional Ethics", "Ethics in Engineering", "Engineering Ethics",
    "Change by Design", "Design Thinking", "Innovation and Design Thinking", "Applied Design Thinking",
    "Design Thinking and Innovation"
  ].map((title, i) => ({
    title,
    author: ["R.R. Gaur", "R. Sangal", "Mike W. Martin", "Roland Schinzinger", "Tim Brown", "Christian Müller-Roterberg"][i % 6],
    subject: "English & Ethics",
    department: "Basic Sciences & Humanities",
    floor: "Ground Floor",
    rack_number: "Rack 18",
    rack_name: "English",
    shelf_number: Math.floor(i / 3) + 1,
    position: `Section A - Shelf ${Math.floor(i / 3) + 1} - Pos ${(i % 3) + 1}`,
    availability_status: "Available",
    is_sample: 0
  })),

  // RACK 19 - Competitive Examinations
  ...[
    "General Knowledge", "Manorama Year Book", "Quantitative Aptitude", "Verbal and Non-Verbal Reasoning",
    "Group Discussion", "Civil Services", "Combined Defence Services", "NDA/NA",
    "National Defence Academy and Naval", "SSC Staff Selection Commission", "General Studies", "GRE Test",
    "General UGC NET/SET/JRF", "TOEFL Test", "IELTS", "International English Language Testing System",
    "Engineering Services Examination", "ESE Services", "IES Services", "Quantitative Aptitude for CAT",
    "Prepare for the GMAT", "Data Interpretation"
  ].map((title, i) => ({
    title,
    author: ["R.S. Aggarwal", "Mammen Mathew", "Arun Sharma", "Barron's", "B.S. Sijwali", "Disha Experts"][i % 6],
    subject: "Competitive Examinations",
    department: "General & Career",
    floor: "Ground Floor",
    rack_number: "Rack 19",
    rack_name: "Competitive Examination Books",
    shelf_number: Math.floor(i / 5) + 1,
    position: `Section B - Shelf ${Math.floor(i / 5) + 1} - Pos ${(i % 5) + 1}`,
    availability_status: i % 5 === 0 ? "Issued" : "Available",
    is_sample: 0
  })),

  // RACK 20 - General Reading
  ...[
    "Spiritual", "Perception, Movement, Emotions", "Love and Affection", "Psychology, Subconscious",
    "Personality Development", "Self-Help Non-Fiction", "Religious Mythology", "Philosophy",
    "Mythology", "Hindu Mythology", "Folk Literature, Fairy Tales, Folk Tales",
    "Management of Personal Life", "Comics", "Poetry", "Children's Literature"
  ].map((title, i) => ({
    title,
    author: ["Swami Vivekananda", "Dale Carnegie", "Stephen R. Covey", "Devdutt Pattanaik", "C. Rajagopalachari", "Rabindranath Tagore"][i % 6],
    subject: "General Reading",
    department: "Library General",
    floor: "Ground Floor",
    rack_number: "Rack 20",
    rack_name: "General Reading",
    shelf_number: Math.floor(i / 3) + 1,
    position: `Shelf ${Math.floor(i / 3) + 1} - Pos ${(i % 3) + 1}`,
    availability_status: "Available",
    is_sample: 0
  })),

  // DIPLOMA BOOKS RACK (Near staircase)
  ...[
    "Engineering Mathematics", "Engineering Physics", "Engineering Chemistry", "Engineering Drawing",
    "Basic Electrical Engineering", "Programming in C", "Data Structures", "Computer Fundamentals",
    "Engineering Mechanics", "Strength of Materials", "Building Materials", "Building Construction",
    "Workshop Technology", "Thermodynamics", "Fluid Mechanics", "Electrical Machines",
    "Digital Electronics", "Surveying", "Concrete Technology", "Automobile Engineering"
  ].map((title, i) => ({
    title: `[Diploma] ${title}`,
    author: ["State Board of Tech. Education", "N.D. Bhatt", "R.K. Rajput", "B.L. Theraja", "E. Balagurusamy", "S.K. Garg"][i % 6],
    subject: "Diploma Studies",
    department: "Diploma",
    floor: "Ground Floor",
    rack_number: "Diploma Books Rack",
    rack_name: "Diploma Books",
    shelf_number: Math.floor(i / 4) + 1,
    position: `Shelf ${Math.floor(i / 4) + 1} - Pos ${(i % 4) + 1}`,
    availability_status: i % 6 === 0 ? "Issued" : "Available",
    is_sample: 1
  })),

  // MBA BOOKS RACK (Near staircase)
  ...[
    "Principles of Management", "Human Resource Management", "Financial Management", "Marketing Management",
    "Organizational Behaviour", "Business Communication", "Business Statistics", "Strategic Management",
    "Operations Management", "Business Economics", "Management Information Systems", "Financial Accounting",
    "Cost Accounting", "Consumer Behaviour", "Entrepreneurship Development", "Business Research Methods",
    "Supply Chain Management", "Project Management", "Digital Marketing", "Business Ethics and Corporate Governance"
  ].map((title, i) => ({
    title: `[MBA] ${title}`,
    author: ["Philip Kotler", "Prasanna Chandra", "K. Aswathappa", "Stephen P. Robbins", "C.R. Kothari", "Sunil Chopra"][i % 6],
    subject: "Master of Business Administration",
    department: "Management Studies",
    floor: "Ground Floor",
    rack_number: "MBA Books Rack",
    rack_name: "MBA Books",
    shelf_number: Math.floor(i / 4) + 1,
    position: `Shelf ${Math.floor(i / 4) + 1} - Pos ${(i % 4) + 1}`,
    availability_status: i % 7 === 0 ? "Issued" : "Available",
    is_sample: 1
  }))
];

// FIRST FLOOR - REFERENCE BOOKS (Racks 1 to 11) & SC/ST Category Racks
const firstFloorBooks = [
  // 1F Rack 1 - Civil Engineering Reference Books
  ...[
    "Structural Analysis", "Structural Analysis – I", "Matrix Methods of Structural Analysis",
    "Basic Structural Analysis", "Advanced Structural Analysis", "Analysis of Structures",
    "Structural Dynamics", "Mechanics of Structures", "Theory of Structures", "Design of Steel Structures",
    "Structural Design in Steel – I, II", "Steel Structures", "Structural Design and Drawing",
    "Reinforced Concrete Structures – Volume I, II", "Advanced R.C.C. Design",
    "Limit State Design of Reinforced Concrete", "Essentials of Bridge Engineering", "Design of Bridges",
    "Railway Engineering", "Highway Engineering", "Highway and Traffic Engineering",
    "Traffic and Highway Engineering", "Pavement Design", "Pavement Analysis and Design",
    "Flow in Open Channels", "Watershed Management", "Ground Water Assessment, Development and Management",
    "Disaster Management", "Environmental Engineering and Management", "Surveying – Volume I, II, III",
    "Plane Surveying", "Higher Surveying", "Advanced Surveying", "Theory of Elasticity",
    "Theory of Elastic Stability", "Theory of Plates and Shells", "Engineering Hydrology", "Hydrology",
    "Groundwater Hydrology", "Concrete Technology", "Properties of Concrete", "Prestressed Concrete Structures",
    "Estimating and Costing", "Foundation Engineering", "Foundation Analysis and Design",
    "Engineering Geology", "Geotechnical Engineering", "Soil Mechanics",
    "Earthquake Resistant Design of Structures", "Dynamics of Structures", "Water Resources Engineering",
    "Irrigation Engineering", "Environmental Engineering", "Water Supply Engineering", "Wastewater Treatment",
    "Transportation Engineering", "Construction Planning and Technology", "Construction Project Management",
    "PERT and CPM", "Building Materials", "Building Construction", "Remote Sensing and GIS"
  ].map((title, i) => ({
    title: `[Ref] ${title}`,
    author: ["B.C. Punmia", "S.K. Garg", "M.S. Shetty", "S. Ramamrutham", "Devdas Menon", "Joseph E. Bowles"][i % 6],
    subject: "Civil Engineering Reference",
    department: "Civil Engineering",
    floor: "First Floor",
    rack_number: "Rack 1",
    rack_name: "Civil Engineering Reference Books",
    shelf_number: Math.floor(i / 12) + 1,
    position: `Ref Section - Shelf ${Math.floor(i / 12) + 1} - Pos ${(i % 12) + 1}`,
    availability_status: "Available",
    is_sample: 0
  })),

  // 1F Rack 2 - Mechanical Engineering Reference Books
  ...[
    "Basic Engineering Thermodynamics", "Applied Thermodynamics", "Fundamentals of Engineering Thermodynamics",
    "Thermodynamics", "Engineering Thermodynamics", "Internal Combustion Engines", "Gas Turbines",
    "Heat and Mass Transfer", "Fundamentals of Engineering Heat and Mass Transfer", "Mass Transfer",
    "Heat Transfer", "Design of Machine Elements", "Machine Drawing", "Design Data Hand Book",
    "Machine Design", "Mechanism and Machine Theory", "Theory of Machines and Mechanisms",
    "Engineering Mechanics", "Engineering Mechanics – Statics", "Engineering Mechanics – Dynamics",
    "Mechanics of Solids", "Computational Fluid Dynamics", "Fluid Mechanics",
    "Fluid Mechanics and Hydraulic Machines", "Material Science and Engineering", "Material Science and Metallurgy",
    "Mechanics of Materials", "Mechanical Behaviour of Materials", "Mechanical Metallurgy", "Nano-Technology",
    "Mechatronics", "Mechatronics System Design", "Power Plant Engineering", "MEMS", "Thermal Engineering",
    "Production Technology", "CAD/CAM Theory and Practice", "Refrigeration and Air Conditioning",
    "Advanced Machining Processes", "Machine Tools", "Jigs and Fixtures", "Hydraulics and Pneumatics",
    "Automobile Engineering", "Rapid Prototyping", "Robotics", "Industrial Robotics",
    "Manufacturing Science", "Production Systems", "Automation", "Computer-Integrated Manufacturing",
    "Physical Metallurgy", "Manufacturing Technology", "Workshop Technology"
  ].map((title, i) => ({
    title: `[Ref] ${title}`,
    author: ["P.K. Nag", "V. Ganesan", "Mikell P. Groover", "S. Timoshenko", "William D. Callister", "R.K. Rajput"][i % 6],
    subject: "Mechanical Engineering Reference",
    department: "Mechanical Engineering",
    floor: "First Floor",
    rack_number: "Rack 2",
    rack_name: "Mechanical Engineering Reference Books",
    shelf_number: Math.floor(i / 10) + 1,
    position: `Ref Section - Shelf ${Math.floor(i / 10) + 1} - Pos ${(i % 10) + 1}`,
    availability_status: "Available",
    is_sample: 0
  })),

  // 1F Rack 3 - Electrical Engineering Reference Books
  ...[
    "Theory and Practice of Electrical Machines", "Electrical Machines", "Renewable Energy",
    "Special Electrical Machines", "Non-Conventional Energy Resources", "Non-Conventional Energy Sources",
    "Wind Electrical Systems", "Solar Energy", "Theory of Alternating Current Machines", "Transformers",
    "Basic Electrical Engineering", "Fundamentals of Electrical Engineering", "Electrical Technology – I, II, III, IV",
    "Power System", "Power Electronics", "Motor Drives", "Electrical Power Systems", "Elements of Power System",
    "Modern Power Electronics", "Power System Analysis and Design", "Industrial and Power Electronics",
    "Power System Protection", "Power System Operation and Control", "Protection and Switchgear",
    "Power Quality", "Power System Stability", "Utilization of Electric Power", "HVDC Transmission",
    "HVDC Power Transmission Systems", "Electromagnetic Waves", "Electromagnetism", "Electromagnetic Fields",
    "Electromagnetic Field Theory", "Engineering Electromagnetics", "Network Analysis", "Medical Instrumentation",
    "Biomedical Instrumentation", "Network Theory", "Engineering Circuit Analysis", "Electric Circuits",
    "Circuit Theory", "Electric Power Distribution System", "Electric Power Transmission", "Digital Image Processing",
    "Electrical Measurements", "Electrical Instrumentation", "Transducers and Instrumentation",
    "Electronic Instrumentation", "Measurement Techniques", "Protective Relays", "Microwave Engineering",
    "Radar Engineering", "Electric and Hybrid Vehicles", "Electrical Vehicle Technology"
  ].map((title, i) => ({
    title: `[Ref] ${title}`,
    author: ["I.J. Nagrath", "P.S. Bimbhra", "B.L. Theraja", "William H. Hayt", "A.K. Sawhney", "C.L. Wadhwa"][i % 6],
    subject: "Electrical Engineering Reference",
    department: "Electrical & Electronics Engineering",
    floor: "First Floor",
    rack_number: "Rack 3",
    rack_name: "Electrical Engineering Reference Books",
    shelf_number: Math.floor(i / 10) + 1,
    position: `Ref Section - Shelf ${Math.floor(i / 10) + 1} - Pos ${(i % 10) + 1}`,
    availability_status: "Available",
    is_sample: 0
  })),

  // 1F Rack 4 - Electronics and Communication Reference Books
  ...[
    "Digital Signal Processing", "Discrete-Time Signal Processing", "Digital Signal Processing Using MATLAB",
    "Basic Electronics", "Industrial Electronics", "Microelectronic Circuits", "Basic Electronics and Linear Circuits",
    "Electronic Devices and Circuits", "Electronic Devices and Circuit Theory", "Semiconductor Devices and Circuits",
    "Advanced Electronic Communications Systems", "Electronics Circuits and Analysis", "Electronic Circuit Analysis",
    "Analog Communications Systems", "Analog Communications", "Digital and Analog Communications",
    "Electronic Circuits and Systems", "Integrated Electronics", "Linear IC Applications", "Linear Integrated Circuits",
    "Amplifiers and Linear ICs", "Digital Circuits", "Pulse and Digital Circuits", "Signals and Systems",
    "Signal Processing", "Statistical Signal Processing and Modeling", "Communication Systems",
    "Principles of Communication Systems", "Communication Systems Engineering", "Electronic Communication Systems",
    "Digital Communications", "Digital Communication Systems", "Telecommunication Switching, Traffic and Networks",
    "Signals, Systems and Transforms", "Antennas", "Antenna and Wave Propagation", "Fiber-Optic Communications",
    "Wireless Communications", "Mobile Communications", "Cellular Telephones", "Satellite Communications",
    "Control Systems", "Control System Analysis and Design", "Feedback and Control Systems", "Automatic Control Systems",
    "Modern Control Engineering", "Digital Control Systems", "Digital Systems", "Digital Logic Design",
    "Switching Theory and Logic Design", "Logic Design", "VLSI Circuit Design", "VLSI Design",
    "VLSI Physical Design", "VLSI Design and Test"
  ].map((title, i) => ({
    title: `[Ref] ${title}`,
    author: ["Alan V. Oppenheim", "Simon Haykin", "Robert L. Boylestad", "Katsuhiko Ogata", "M. Morris Mano", "Wayne Tomasi"][i % 6],
    subject: "Electronics and Communication Reference",
    department: "Electronics & Communication Engineering",
    floor: "First Floor",
    rack_number: "Rack 4",
    rack_name: "Electronics and Communication Reference Books",
    shelf_number: Math.floor(i / 10) + 1,
    position: `Ref Section - Shelf ${Math.floor(i / 10) + 1} - Pos ${(i % 10) + 1}`,
    availability_status: "Available",
    is_sample: 0
  })),

  // 1F Rack 5 - Computer Science Reference Books
  ...[
    "Computers and Commonsense", "Computers and Information Technology", "Distributed and Cloud Computing",
    "Cloud Computing", "Embedded Microcomputer Systems", "Embedded System Design", "Internet of Things",
    "Internet of Things Architecture and Design", "IoT Fundamentals", "Embedded Real-Time Systems Programming",
    "Embedded Microcontrollers", "Microprocessors and Interfacing", "Algorithms", "Computer Algorithms",
    "Design and Analysis of Algorithms", "Design and Analysis of Computer Algorithms", "Software Engineering",
    "Software Engineering Principles and Practice", "Object-Oriented Software Engineering", "Software Design Methodology",
    "Software Architecture", "Software Project Management", "Designing the User Interface", "User Interface Design",
    "Human Computer Interface", "Applying UML and Patterns", "UML Distilled", "The Unified Modeling Language",
    "Design Patterns", "Computer Components", "Systems Analysis and Design", "Advanced Computer Architecture",
    "Computer Organization", "Computer Architecture and Parallel Processing", "Computer Organization and Architecture",
    "Automata Theory, Formal Languages and Computation", "Theory of Computation", "Automata and Languages",
    "Hadoop for Dummies", "Programming in ANSI C", "Programming in C", "Programming and Data Structures",
    "Data Structures with C", "Data Structures", "Data Structures and Algorithms", "Programming in C++",
    "Object-Oriented Programming", "UNIX and UNIX Programming", "UNIX Programming Environment",
    "UNIX Network Programming", "Operating Systems", "Modern Operating Systems", "Distributed Operating Systems",
    "Java Programming", "Java Servlets", "Big Java", "Advanced Java Programming", "Linux Kernel Programming",
    "Linux Programming", "Distributed Computing", "Distributed Systems", "Compilers", "Compiler Design",
    "Python Programming", "Mobile Computing", "Database Management Systems", "Database Systems", "Database Technology"
  ].map((title, i) => ({
    title: `[Ref] ${title}`,
    author: ["Thomas H. Cormen", "Andrew S. Tanenbaum", "Roger S. Pressman", "Abraham Silberschatz", "Bjarne Stroustrup", "Alfred V. Aho"][i % 6],
    subject: "Computer Science Reference",
    department: "Computer Science & Engineering",
    floor: "First Floor",
    rack_number: "Rack 5",
    rack_name: "Computer Science Reference Books",
    shelf_number: Math.floor(i / 12) + 1,
    position: `Ref Section - Shelf ${Math.floor(i / 12) + 1} - Pos ${(i % 12) + 1}`,
    availability_status: "Available",
    is_sample: 0
  })),

  // 1F Rack 6 - AI and ML Reference Books
  ...[
    "DEVOPS Automation Cookbook", "DEVOPS: A Software Architect's Handbook", "Lean DEVOPS",
    "Real-World DEVOPS Practices", "DEVOPS Handbook", "Ultimate Data Engineering", "Data Engineering Fundamentals",
    "Data Mining", "Data Mining Techniques", "Reinforcement Learning", "Hack Proofing", "Hacking", "Ethical Hacking",
    "Information Security", "Cyber Security", "Network Security", "Cryptography", "Cryptography and Security",
    "Cryptography and Network Security", "Deep Learning", "Deep Learning with Python", "Learning Deep Learning",
    "Generative Deep Learning", "Generative AI with Python", "Machine Learning", "Applied Machine Learning",
    "Machine Learning with Python", "Neural Networks", "Fuzzy Logic and Neural Networks", "Soft Computing",
    "Recommender Systems", "Speech and Language Processing", "Natural Language Processing",
    "Natural Language Processing and Information Retrieval", "Data Science", "Data Science and Analytics",
    "Data Science from Scratch", "Data Science with Jupyter", "Large Language Models", "Generative AI",
    "Data Analytics and Visualization", "Generative AI for Everyone", "Generative AI Techniques and Applications",
    "Data Science Concepts and Practice", "Data Science and Machine Learning Using Python", "Big Data and Analytics",
    "Big Data", "Math for Data Science", "Data Analytics"
  ].map((title, i) => ({
    title: `[Ref] ${title}`,
    author: ["Ian Goodfellow", "Francois Chollet", "Christopher M. Bishop", "Stuart Russell", "Daniel Jurafsky", "Aurélien Géron"][i % 6],
    subject: "AI and ML Reference",
    department: "AI & ML",
    floor: "First Floor",
    rack_number: "Rack 6",
    rack_name: "AI and ML Reference Books",
    shelf_number: Math.floor(i / 10) + 1,
    position: `Ref Section - Shelf ${Math.floor(i / 10) + 1} - Pos ${(i % 10) + 1}`,
    availability_status: "Available",
    is_sample: 0
  })),

  // 1F Rack 7 - Artificial Intelligence Reference Books
  ...[
    "Computer Graphics", "Computer Graphics Using OpenGL", "Mathematical Elements for Computer Graphics",
    "Procedural Elements for Computer Graphics", "Multimedia Applications", "Multimedia Communications",
    "Flash MX", "Multimedia Databases", "Multimedia in Action", "Hyper Text Markup Language",
    "Web Technologies", "Web Programming", "Web Programming with HTML", "Programming with World Wide Web",
    "Frontiers of Electronic Commerce"
  ].map((title, i) => ({
    title: `[Ref] ${title}`,
    author: ["Donald Hearn", "David F. Rogers", "Robert W. Sebesta", "Fred Halsall", "Ravi Kalakota", "Uttam K. Roy"][i % 6],
    subject: "Artificial Intelligence Reference",
    department: "Artificial Intelligence",
    floor: "First Floor",
    rack_number: "Rack 7",
    rack_name: "Artificial Intelligence Reference Books",
    shelf_number: Math.floor(i / 4) + 1,
    position: `Ref Section - Shelf ${Math.floor(i / 4) + 1} - Pos ${(i % 4) + 1}`,
    availability_status: "Available",
    is_sample: 0
  })),

  // 1F Rack 8 - Mathematics Reference Books
  ...[
    "Engineering Mathematics", "Advanced Engineering Mathematics", "Engineering Mathematics – Volume I",
    "Engineering Mathematics – Volume II", "Engineering Mathematics – Volume III", "Engineering Mathematics MATLAB",
    "Mathematical Methods", "Differential Calculus", "Differential Equation and Vector Calculus",
    "Special Functions and Complex Variables", "Discrete Mathematical Structures", "Numerical Analysis",
    "Linear Algebra and Calculus", "Complex Variables and Statistical Methods",
    "Mathematical Foundations of Computer Science", "Discrete Mathematics"
  ].map((title, i) => ({
    title: `[Ref] ${title}`,
    author: ["Erwin Kreyszig", "B.S. Grewal", "Kenneth H. Rosen", "Gilbert Strang", "Shanti Narayan", "H.K. Dass"][i % 6],
    subject: "Mathematics Reference",
    department: "Basic Sciences & Humanities",
    floor: "First Floor",
    rack_number: "Rack 8",
    rack_name: "Mathematics Reference Books",
    shelf_number: Math.floor(i / 4) + 1,
    position: `Ref Section - Shelf ${Math.floor(i / 4) + 1} - Pos ${(i % 4) + 1}`,
    availability_status: "Available",
    is_sample: 0
  })),

  // 1F Rack 9 - Chemistry Reference Books
  ...[
    "Applied Chemistry", "Concise Inorganic Chemistry", "Engineering Chemistry",
    "Engineering Chemistry – Volume I", "Engineering Chemistry – Volume II",
    "Engineering Chemistry (with Laboratory Experiments)"
  ].map((title, i) => ({
    title: `[Ref] ${title}`,
    author: ["J.D. Lee", "P.C. Jain", "Monica Jain", "Shashi Chawla", "O.G. Palanna", "S.S. Dara"][i % 6],
    subject: "Chemistry Reference",
    department: "Basic Sciences & Humanities",
    floor: "First Floor",
    rack_number: "Rack 9",
    rack_name: "Chemistry Reference Books",
    shelf_number: 1,
    position: `Ref Section - Shelf 1 - Pos ${i + 1}`,
    availability_status: "Available",
    is_sample: 0
  })),

  // 1F Rack 10 - Physics Reference Books
  ...[
    "Advanced Engineering Physics", "Concepts of Modern Physics", "Fundamentals of Optics",
    "Introduction to Solid State Physics", "Laser and Fiber Optics", "Quantum Physics Reference Manual",
    "Electromagnetic Field Principles", "Semiconductor Physics and Devices", "Acoustics and Ultrasonics",
    "Nanotechnology Fundamentals"
  ].map((title, i) => ({
    title: `[Ref] ${title}`,
    author: ["Arthur Beiser", "Charles Kittel", "Eugene Hecht", "Donald A. Neamen", "Ajoy Ghatak", "David Halliday"][i % 6],
    subject: "Physics Reference",
    department: "Basic Sciences & Humanities",
    floor: "First Floor",
    rack_number: "Rack 10",
    rack_name: "Physics Reference Books",
    shelf_number: Math.floor(i / 3) + 1,
    position: `Ref Section - Shelf ${Math.floor(i / 3) + 1} - Pos ${(i % 3) + 1}`,
    availability_status: "Available",
    is_sample: 1
  })),

  // 1F Rack 11 - English Reference Books
  ...[
    "Advanced English Grammar & Composition", "Technical Writing Principles", "Business Communication Handbook",
    "International English for Academic Purposes", "Oxford Advanced Learner's Reference", "Lexicon and Phonetics",
    "Public Speaking & Presentation Skills", "Professional Ethics Case Studies", "Design Thinking Workshop Guide",
    "Research Paper Writing and Publishing"
  ].map((title, i) => ({
    title: `[Ref] ${title}`,
    author: ["A.S. Hornby", "Meenakshi Raman", "Michael Swan", "Tim Brown", "H.M. Prasad", "Geoffrey Leech"][i % 6],
    subject: "English Reference",
    department: "Basic Sciences & Humanities",
    floor: "First Floor",
    rack_number: "Rack 11",
    rack_name: "English Reference Books",
    shelf_number: Math.floor(i / 3) + 1,
    position: `Ref Section - Shelf ${Math.floor(i / 3) + 1} - Pos ${(i % 3) + 1}`,
    availability_status: "Available",
    is_sample: 0
  })),

  // SC/ST BOOKS RACK 1
  ...[
    "Book Bank: Basic Electrical Engineering", "Book Bank: Data Structures & Algorithms",
    "Book Bank: Engineering Mathematics – I", "Book Bank: Engineering Mathematics – II",
    "Book Bank: Digital Logic Design", "Book Bank: Python Programming", "Book Bank: Operating Systems",
    "Book Bank: Database Management Systems", "Book Bank: Strength of Materials", "Book Bank: Fluid Mechanics"
  ].map((title, i) => ({
    title,
    author: ["Govt Book Bank Scheme", "B.S. Grewal", "E. Balagurusamy", "S. Ramamrutham", "A. Silberschatz"][i % 5],
    subject: "SC/ST Book Bank Collection 1",
    department: "SC/ST Book Bank",
    floor: "First Floor",
    rack_number: "SC/ST Books Rack 1",
    rack_name: "SC/ST Books Rack 1",
    shelf_number: Math.floor(i / 3) + 1,
    position: `Shelf ${Math.floor(i / 3) + 1} - Pos ${(i % 3) + 1}`,
    availability_status: "Available",
    is_sample: 1
  })),

  // SC/ST BOOKS RACK 2
  ...[
    "Book Bank: Electronic Devices and Circuits", "Book Bank: Signals and Systems",
    "Book Bank: Power Systems Engineering", "Book Bank: Microprocessors and Interfacing",
    "Book Bank: Software Engineering", "Book Bank: Machine Learning Basics", "Book Bank: Engineering Chemistry",
    "Book Bank: Engineering Physics", "Book Bank: Communication Skills", "Book Bank: Surveying & Geomatics"
  ].map((title, i) => ({
    title,
    author: ["Govt Book Bank Scheme", "Simon Haykin", "I.J. Nagrath", "Roger S. Pressman", "P.C. Jain"][i % 5],
    subject: "SC/ST Book Bank Collection 2",
    department: "SC/ST Book Bank",
    floor: "First Floor",
    rack_number: "SC/ST Books Rack 2",
    rack_name: "SC/ST Books Rack 2",
    shelf_number: Math.floor(i / 3) + 1,
    position: `Shelf ${Math.floor(i / 3) + 1} - Pos ${(i % 3) + 1}`,
    availability_status: "Available",
    is_sample: 1
  }))
];

module.exports = { groundFloorBooks, firstFloorBooks };
