const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');
const { groundFloorBooks, firstFloorBooks } = require('./seedData');

const dbPath = path.resolve(__dirname, 'smart_library.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database at', dbPath);
  }
});

// Helper for promise-based queries
function runAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

function allAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function getAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

async function initDatabase() {
  // Create tables
  await runAsync(`
    CREATE TABLE IF NOT EXISTS floors (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT
    )
  `);

  await runAsync(`
    CREATE TABLE IF NOT EXISTS racks (
      id TEXT PRIMARY KEY,
      floor TEXT NOT NULL,
      rack_number TEXT NOT NULL,
      rack_name TEXT NOT NULL,
      category TEXT NOT NULL,
      subject TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await runAsync(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      book_id TEXT UNIQUE,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      subject TEXT NOT NULL,
      department TEXT NOT NULL,
      floor TEXT NOT NULL,
      rack_number TEXT NOT NULL,
      rack_name TEXT NOT NULL,
      shelf_number INTEGER DEFAULT 1,
      position TEXT,
      availability_status TEXT DEFAULT 'Available',
      is_sample INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await runAsync(`
    CREATE TABLE IF NOT EXISTS staff (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT DEFAULT 'Librarian',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Seed default staff accounts
  const staffCount = await getAsync(`SELECT COUNT(*) as count FROM staff`);
  if (staffCount.count === 0) {
    const salt = await bcrypt.genSalt(10);
    const staffHash = await bcrypt.hash('staff123', salt);
    const adminHash = await bcrypt.hash('admin123', salt);

    await runAsync(
      `INSERT INTO staff (username, password_hash, name, role) VALUES (?, ?, ?, ?)`,
      ['staff', staffHash, 'Library Assistant', 'Librarian']
    );
    await runAsync(
      `INSERT INTO staff (username, password_hash, name, role) VALUES (?, ?, ?, ?)`,
      ['admin', adminHash, 'Head Librarian', 'Administrator']
    );
    console.log('Seeded default staff accounts: staff / staff123, admin / admin123');
  }

  // Seed Floors
  const floorCount = await getAsync(`SELECT COUNT(*) as count FROM floors`);
  if (floorCount.count === 0) {
    await runAsync(`INSERT INTO floors (id, name, description) VALUES ('GF', 'Ground Floor', 'Main Library Stacks, Digital Library, Reading Hall & Entrance')`);
    await runAsync(`INSERT INTO floors (id, name, description) VALUES ('1F', 'First Floor', 'Reference Stacks, Project Rooms, SC/ST Book Bank & Charging Zone')`);
  }

  // Seed Racks if empty
  const rackCount = await getAsync(`SELECT COUNT(*) as count FROM racks`);
  if (rackCount.count === 0) {
    // Ground Floor Racks
    const gfRacks = [
      { id: 'GF-R01', num: 'Rack 1', name: 'Civil Engineering', cat: 'Main' },
      { id: 'GF-R02', num: 'Rack 2', name: 'Civil Engineering', cat: 'Main' },
      { id: 'GF-R03', num: 'Rack 3', name: 'Mechanical Engineering', cat: 'Main' },
      { id: 'GF-R04', num: 'Rack 4', name: 'Mechanical Engineering', cat: 'Main' },
      { id: 'GF-R05', num: 'Rack 5', name: 'Electrical Engineering', cat: 'Main' },
      { id: 'GF-R06', num: 'Rack 6', name: 'Electrical Engineering', cat: 'Main' },
      { id: 'GF-R07', num: 'Rack 7', name: 'Electronics and Communication Engineering', cat: 'Main' },
      { id: 'GF-R08', num: 'Rack 8', name: 'Electronics and Communication Engineering', cat: 'Main' },
      { id: 'GF-R09', num: 'Rack 9', name: 'Computer Science Engineering', cat: 'Main' },
      { id: 'GF-R10', num: 'Rack 10', name: 'Computer Science Engineering', cat: 'Main' },
      { id: 'GF-R11', num: 'Rack 11', name: 'Artificial Intelligence and Machine Learning', cat: 'Main' },
      { id: 'GF-R12', num: 'Rack 12', name: 'Artificial Intelligence and Machine Learning', cat: 'Main' },
      { id: 'GF-R13', num: 'Rack 13', name: 'Artificial Intelligence', cat: 'Main' },
      { id: 'GF-R14', num: 'Rack 14', name: 'Mathematics', cat: 'Main' },
      { id: 'GF-R15', num: 'Rack 15', name: 'Mathematics', cat: 'Main' },
      { id: 'GF-R16', num: 'Rack 16', name: 'Chemistry', cat: 'Main' },
      { id: 'GF-R17', num: 'Rack 17', name: 'Physics', cat: 'Main' },
      { id: 'GF-R18', num: 'Rack 18', name: 'English', cat: 'Main' },
      { id: 'GF-R19', num: 'Rack 19', name: 'Competitive Examination Books', cat: 'Main' },
      { id: 'GF-R20', num: 'Rack 20', name: 'General Reading', cat: 'Main' },
      { id: 'GF-DIPLOMA', num: 'Diploma Books Rack', name: 'Diploma Books', cat: 'Diploma' },
      { id: 'GF-MBA', num: 'MBA Books Rack', name: 'MBA Books', cat: 'MBA' }
    ];

    for (const r of gfRacks) {
      await runAsync(
        `INSERT INTO racks (id, floor, rack_number, rack_name, category, subject) VALUES (?, ?, ?, ?, ?, ?)`,
        [r.id, 'Ground Floor', r.num, r.name, r.cat, r.name]
      );
    }

    // First Floor Racks
    const ffRacks = [
      { id: '1F-R01', num: 'Rack 1', name: 'Civil Engineering Reference Books', cat: 'Reference' },
      { id: '1F-R02', num: 'Rack 2', name: 'Mechanical Engineering Reference Books', cat: 'Reference' },
      { id: '1F-R03', num: 'Rack 3', name: 'Electrical Engineering Reference Books', cat: 'Reference' },
      { id: '1F-R04', num: 'Rack 4', name: 'Electronics and Communication Reference Books', cat: 'Reference' },
      { id: '1F-R05', num: 'Rack 5', name: 'Computer Science Reference Books', cat: 'Reference' },
      { id: '1F-R06', num: 'Rack 6', name: 'AI and ML Reference Books', cat: 'Reference' },
      { id: '1F-R07', num: 'Rack 7', name: 'Artificial Intelligence Reference Books', cat: 'Reference' },
      { id: '1F-R08', num: 'Rack 8', name: 'Mathematics Reference Books', cat: 'Reference' },
      { id: '1F-R09', num: 'Rack 9', name: 'Chemistry Reference Books', cat: 'Reference' },
      { id: '1F-R10', num: 'Rack 10', name: 'Physics Reference Books', cat: 'Reference' },
      { id: '1F-R11', num: 'Rack 11', name: 'English Reference Books', cat: 'Reference' },
      { id: '1F-SCST-1', num: 'SC/ST Books Rack 1', name: 'SC/ST Books Rack 1', cat: 'SC/ST' },
      { id: '1F-SCST-2', num: 'SC/ST Books Rack 2', name: 'SC/ST Books Rack 2', cat: 'SC/ST' }
    ];

    for (const r of ffRacks) {
      await runAsync(
        `INSERT INTO racks (id, floor, rack_number, rack_name, category, subject) VALUES (?, ?, ?, ?, ?, ?)`,
        [r.id, 'First Floor', r.num, r.name, r.cat, r.name]
      );
    }
  }

  // Seed Books if empty
  const booksCount = await getAsync(`SELECT COUNT(*) as count FROM books`);
  if (booksCount.count === 0) {
    console.log('Seeding library book catalog into database...');
    let seq = 1;

    for (const b of groundFloorBooks) {
      const bookId = `SVEC-GF-${String(seq).padStart(4, '0')}`;
      seq++;
      await runAsync(
        `INSERT INTO books (book_id, title, author, subject, department, floor, rack_number, rack_name, shelf_number, position, availability_status, is_sample)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [bookId, b.title, b.author, b.subject, b.department, b.floor, b.rack_number, b.rack_name, b.shelf_number, b.position, b.availability_status, b.is_sample]
      );
    }

    let ffSeq = 1;
    for (const b of firstFloorBooks) {
      const bookId = `SVEC-1F-${String(ffSeq).padStart(4, '0')}`;
      ffSeq++;
      await runAsync(
        `INSERT INTO books (book_id, title, author, subject, department, floor, rack_number, rack_name, shelf_number, position, availability_status, is_sample)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [bookId, b.title, b.author, b.subject, b.department, b.floor, b.rack_number, b.rack_name, b.shelf_number, b.position, b.availability_status, b.is_sample]
      );
    }

    console.log(`Successfully seeded ${seq + ffSeq - 2} books into library catalog!`);
  }
}

module.exports = {
  db,
  runAsync,
  allAsync,
  getAsync,
  initDatabase
};
