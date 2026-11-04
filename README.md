# Sri Vasavi Engineering College (SVEC)

## Smart Library Book Finder and Indoor Navigation System

A full-stack, responsive, and indoor navigation system designed and engineered for **Sri Vasavi Engineering College (Autonomous)**.

The application transforms physical library floor maps into interactive digital waypoint navigation networks. It enables students to search over 1,000+ cataloged textbooks, locate their exact floor, rack, shelf, and position, and follow turn-by-turn routes with animated walking markers. Authorized library staff can manage the catalog, add books, toggle availability (Available <-> Issued), and relocate books with real-time synchronization.

---

## 🏛️ Exact Floor Layout Architectural Reproduction

The indoor maps faithfully reproduce the official hand-drawn library sketches:

### 1. Ground Floor Map

- **Main Entrance & ID Scanners**: Left-wall entrance with door indicator, staff member table, and dual RFID/barcode ID turnstiles.
- **Staff Counter & Admin**: L-shaped Library Staff Sitting Desk and enclosed Head of Library Room with executive desk.
- **Digital Library**: Dedicated computer lab room with 8 workstation desks and dedicated entry.
- **Steps / Staircase**: Curved passage connecting Ground Floor directly to First Floor.
- **Diploma & MBA Racks**: Single dedicated row near the staircase containing:
  - _Diploma Books Rack_ (with Section A and Section B dividers)
  - _MBA Books Rack_ (with Section A and Section B dividers)
- **Newspaper Stand & Study Tables**: Central newspaper kiosk and two pairs of long study tables with seating.
- **20 Main Book Racks**: Positioned in two adjacent columns:
  - **Column 1 (Racks 1 to 10)**: Civil Engineering (Racks 1 & 2), Mechanical Engineering (Racks 3 & 4), Electrical Engineering (Racks 5 & 6), Electronics and Communication Engineering (Racks 7 & 8), Computer Science Engineering (Racks 9 & 10).
  - **Column 2 (Racks 11 to 20)**: AI & ML (Racks 11 & 12), Artificial Intelligence (Rack 13), Mathematics (Racks 14 & 15), Chemistry (Rack 16), Physics (Rack 17), English & Ethics (Rack 18), Competitive Examinations (Rack 19), General Reading (Rack 20).

### 2. First Floor Map

- **Laptop Charging Area**: Positioned on the **LEFT side** with 3 long charging benches and power outlets.
- **Project Working Rooms**: 4 private rooms (**Project Working Room 1, 2, 3, 4**) along the northern perimeter with conference tables, chairs, and glass doors.
- **Central Study Tables**: Long shared reading tables.
- **SC/ST Book Bank**: Two dedicated racks (_SC/ST Books Rack 1_ and _SC/ST Books Rack 2_).
- **11 Reference Book Racks**: Positioned on the **RIGHT side** next to the study area:
  - Rack 1: Civil Engineering Reference Books
  - Rack 2: Mechanical Engineering Reference Books
  - Rack 3: Electrical Engineering Reference Books
  - Rack 4: Electronics and Communication Reference Books
  - Rack 5: Computer Science Reference Books
  - Rack 6: AI and ML Reference Books
  - Rack 7: Artificial Intelligence Reference Books
  - Rack 8: Mathematics Reference Books
  - Rack 9: Chemistry Reference Books
  - Rack 10: Physics Reference Books
  - Rack 11: English Reference Books
- **Staircase**: Matching staircase landing with navigation between floors.

---

## 🛠️ Technology Stack

- **Frontend**: React.js 19, Vite 8, Lucide React icons, Canvas Confetti, QRCode, Vanilla CSS Design System.
- **Backend**: Node.js, Express.js, CORS, JSON Web Tokens (JWT), Bcrypt password hashing.
- **Database**: SQLite3 with auto-initialization, table schemas, and complete library catalog seed (1,046+ volumes).
- **Navigation Engine**: Dijkstra's algorithm for shortest walkable corridor pathfinding with turn-by-turn voice and visual instructions.

---

## 📂 Project Structure

```
smart-library/
├── backend/
│   ├── controllers/
│   │   ├── authController.js       # Staff login & profile verification
│   │   └── bookController.js       # Search, CRUD, stats, location updates
│   ├── database/
│   │   ├── database.js             # SQLite connection & table schemas
│   │   ├── seedData.js             # 1,046 college library book titles transcribed
│   │   └── smart_library.db        # SQLite database file
│   ├── middleware/
│   │   └── auth.js                 # JWT bearer token verification
│   ├── routes/
│   │   ├── authRoutes.js           # /api/auth/login, /api/auth/me
│   │   └── bookRoutes.js           # /api/books (search, stats, CRUD, patch)
│   ├── package.json
│   └── server.js                   # Express server entrypoint (Port 5000)
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FirstFloorSvg.jsx   # SVG layout reproducing 1st Floor sketch
│   │   │   ├── GroundFloorSvg.jsx  # SVG layout reproducing Ground Floor sketch
│   │   │   ├── InteractiveMapViewer.jsx # Master map with pathfinding & animations
│   │   │   ├── Navbar.jsx          # Responsive brand navigation
│   │   │   └── QRCodeModal.jsx     # Physical entrance QR generator
│   │   ├── maps/
│   │   │   ├── mapData.js          # SVG coordinates, racks & obstacles
│   │   │   └── navigationEngine.js # Dijkstra pathfinder & turn instructions
│   │   ├── pages/
│   │   │   ├── HomePage.jsx        # Landing hero, portal cards & stats
│   │   │   ├── StaffPortal.jsx     # Secure inventory management dashboard
│   │   │   └── StudentPortal.jsx   # Book search & indoor navigation launcher
│   │   ├── services/
│   │   │   └── api.js              # REST API client
│   │   ├── App.jsx                 # Top-level portal controller
│   │   ├── index.css               # College library design system
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
│
└── README.md
```

---

## 🚀 Running the Project Locally

### 1. Start the Backend Server:

```powershell
# In project root:
node backend/server.js
```

The backend initializes SQLite, seeds the book database, and runs on `http://localhost:5000`.

### 2. Start the Frontend Development Server:

```powershell
# In a second terminal:
cd frontend
npm run dev
```

Open your browser at `http://127.0.0.1:5173/`.

---

## 🔑 Default Staff Credentials

- **Username**: `staff`
- **Password**: `staff123`
- _Administrator_: `admin` / `admin123`

_Passwords are securely hashed using `bcrypt` in the database._

---

## 📱 Physical Entrance QR Code Setup

1. Click the **Entrance QR** button in the top navigation bar.
2. Enter your live college web address (e.g. `https://srivasaviengg-library.edu.in/student`).
3. Click **Download PNG** or **Print Badge**.
4. Affix the printed standee at the physical library entrance turnstiles. Students scanning with their phone cameras will instantly launch the book search and indoor navigation system without installing any apps!
