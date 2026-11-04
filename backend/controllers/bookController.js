const { runAsync, allAsync, getAsync } = require('../database/database');

// Search books for Student and Staff portals
async function searchBooks(req, res) {
  try {
    const { q, title, author, subject, department, floor, rack_number, availability } = req.query;

    let sql = `SELECT * FROM books WHERE 1=1`;
    const params = [];

    if (q && q.trim()) {
      const term = `%${q.trim()}%`;
      sql += ` AND (title LIKE ? OR author LIKE ? OR subject LIKE ? OR department LIKE ? OR rack_number LIKE ? OR rack_name LIKE ?)`;
      params.push(term, term, term, term, term, term);
    }

    if (title && title.trim()) {
      sql += ` AND title LIKE ?`;
      params.push(`%${title.trim()}%`);
    }

    if (author && author.trim()) {
      sql += ` AND author LIKE ?`;
      params.push(`%${author.trim()}%`);
    }

    if (subject && subject.trim()) {
      sql += ` AND (subject LIKE ? OR rack_name LIKE ?)`;
      params.push(`%${subject.trim()}%`, `%${subject.trim()}%`);
    }

    if (department && department.trim() && department !== 'All') {
      sql += ` AND department LIKE ?`;
      params.push(`%${department.trim()}%`);
    }

    if (floor && floor.trim() && floor !== 'All') {
      sql += ` AND floor = ?`;
      params.push(floor.trim());
    }

    if (rack_number && rack_number.trim() && rack_number !== 'All') {
      sql += ` AND rack_number = ?`;
      params.push(rack_number.trim());
    }

    if (availability && availability.trim() && availability !== 'All') {
      sql += ` AND availability_status = ?`;
      params.push(availability.trim());
    }

    sql += ` ORDER BY floor ASC, rack_number ASC, title ASC LIMIT 300`;

    const books = await allAsync(sql, params);
    res.json({ count: books.length, books });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Failed to search books.' });
  }
}

// Get library inventory statistics
async function getStats(req, res) {
  try {
    const totalBooks = await getAsync(`SELECT COUNT(*) as count FROM books`);
    const availableBooks = await getAsync(`SELECT COUNT(*) as count FROM books WHERE availability_status = 'Available'`);
    const unavailableBooks = await getAsync(`SELECT COUNT(*) as count FROM books WHERE availability_status != 'Available'`);
    const totalRacks = await getAsync(`SELECT COUNT(*) as count FROM racks`);
    const gfBooks = await getAsync(`SELECT COUNT(*) as count FROM books WHERE floor = 'Ground Floor'`);
    const ffBooks = await getAsync(`SELECT COUNT(*) as count FROM books WHERE floor = 'First Floor'`);

    res.json({
      totalBooks: totalBooks.count,
      availableBooks: availableBooks.count,
      unavailableBooks: unavailableBooks.count,
      totalRacks: totalRacks.count,
      groundFloorBooks: gfBooks.count,
      firstFloorBooks: ffBooks.count
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ error: 'Failed to load library statistics.' });
  }
}

// Get all racks with book counts
async function getRacks(req, res) {
  try {
    const sql = `
      SELECT r.*, COUNT(b.id) as book_count
      FROM racks r
      LEFT JOIN books b ON r.floor = b.floor AND r.rack_number = b.rack_number
      GROUP BY r.id
      ORDER BY r.floor ASC, r.id ASC
    `;
    const racks = await allAsync(sql);
    res.json({ racks });
  } catch (err) {
    console.error('Get racks error:', err);
    res.status(500).json({ error: 'Failed to load racks.' });
  }
}

// Get paginated books list
async function getAllBooks(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;
    const { floor, rack, search } = req.query;

    let whereClause = ` WHERE 1=1`;
    const params = [];

    if (floor && floor !== 'All') {
      whereClause += ` AND floor = ?`;
      params.push(floor);
    }
    if (rack && rack !== 'All') {
      whereClause += ` AND rack_number = ?`;
      params.push(rack);
    }
    if (search && search.trim()) {
      whereClause += ` AND (title LIKE ? OR author LIKE ? OR subject LIKE ? OR book_id LIKE ?)`;
      const term = `%${search.trim()}%`;
      params.push(term, term, term, term);
    }

    const totalRow = await getAsync(`SELECT COUNT(*) as total FROM books ${whereClause}`, params);
    const books = await allAsync(
      `SELECT * FROM books ${whereClause} ORDER BY id DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    res.json({
      books,
      pagination: {
        page,
        limit,
        total: totalRow.total,
        totalPages: Math.ceil(totalRow.total / limit)
      }
    });
  } catch (err) {
    console.error('Get all books error:', err);
    res.status(500).json({ error: 'Failed to retrieve books.' });
  }
}

// Get single book
async function getBookById(req, res) {
  try {
    const book = await getAsync(`SELECT * FROM books WHERE id = ?`, [req.params.id]);
    if (!book) {
      return res.status(404).json({ error: 'Book not found.' });
    }
    res.json({ book });
  } catch (err) {
    console.error('Get book error:', err);
    res.status(500).json({ error: 'Failed to retrieve book.' });
  }
}

// Create new book
async function createBook(req, res) {
  try {
    const {
      title,
      author,
      subject,
      department,
      floor,
      rack_number,
      rack_name,
      shelf_number,
      position,
      availability_status,
      is_sample
    } = req.body;

    if (!title || !floor || !rack_number) {
      return res.status(400).json({ error: 'Title, floor, and rack number are required.' });
    }

    // Generate unique book ID
    const countRow = await getAsync(`SELECT COUNT(*) as count FROM books`);
    const prefix = floor.includes('First') ? 'SVEC-1F' : 'SVEC-GF';
    const bookId = `${prefix}-${String(countRow.count + 1).padStart(4, '0')}`;

    const result = await runAsync(
      `INSERT INTO books (
        book_id, title, author, subject, department, floor,
        rack_number, rack_name, shelf_number, position,
        availability_status, is_sample
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        bookId,
        title.trim(),
        author ? author.trim() : 'Unknown Author',
        subject ? subject.trim() : 'General',
        department ? department.trim() : 'General',
        floor,
        rack_number,
        rack_name || rack_number,
        parseInt(shelf_number) || 1,
        position || `Shelf ${shelf_number || 1}`,
        availability_status || 'Available',
        is_sample ? 1 : 0
      ]
    );

    const createdBook = await getAsync(`SELECT * FROM books WHERE id = ?`, [result.lastID]);
    res.status(201).json({ message: 'Book created successfully', book: createdBook });
  } catch (err) {
    console.error('Create book error:', err);
    res.status(500).json({ error: 'Failed to create book record.' });
  }
}

// Update book
async function updateBook(req, res) {
  try {
    const { id } = req.params;
    const {
      title,
      author,
      subject,
      department,
      floor,
      rack_number,
      rack_name,
      shelf_number,
      position,
      availability_status
    } = req.body;

    const existing = await getAsync(`SELECT * FROM books WHERE id = ?`, [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Book not found.' });
    }

    await runAsync(
      `UPDATE books SET
        title = ?,
        author = ?,
        subject = ?,
        department = ?,
        floor = ?,
        rack_number = ?,
        rack_name = ?,
        shelf_number = ?,
        position = ?,
        availability_status = ?,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        title ?? existing.title,
        author ?? existing.author,
        subject ?? existing.subject,
        department ?? existing.department,
        floor ?? existing.floor,
        rack_number ?? existing.rack_number,
        rack_name ?? existing.rack_name,
        parseInt(shelf_number) || existing.shelf_number,
        position ?? existing.position,
        availability_status ?? existing.availability_status,
        id
      ]
    );

    const updatedBook = await getAsync(`SELECT * FROM books WHERE id = ?`, [id]);
    res.json({ message: 'Book updated successfully', book: updatedBook });
  } catch (err) {
    console.error('Update book error:', err);
    res.status(500).json({ error: 'Failed to update book record.' });
  }
}

// Update book availability (Quick toggle)
async function updateAvailability(req, res) {
  try {
    const { id } = req.params;
    const { availability_status } = req.body;

    if (!availability_status) {
      return res.status(400).json({ error: 'Availability status is required (Available / Issued).' });
    }

    const existing = await getAsync(`SELECT * FROM books WHERE id = ?`, [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Book not found.' });
    }

    await runAsync(
      `UPDATE books SET availability_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [availability_status, id]
    );

    const updatedBook = await getAsync(`SELECT * FROM books WHERE id = ?`, [id]);
    res.json({ message: `Book status changed to ${availability_status}`, book: updatedBook });
  } catch (err) {
    console.error('Update availability error:', err);
    res.status(500).json({ error: 'Failed to update availability status.' });
  }
}

// Update book location (rack / shelf / position)
async function updateLocation(req, res) {
  try {
    const { id } = req.params;
    const { floor, rack_number, rack_name, shelf_number, position } = req.body;

    const existing = await getAsync(`SELECT * FROM books WHERE id = ?`, [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Book not found.' });
    }

    await runAsync(
      `UPDATE books SET
        floor = ?,
        rack_number = ?,
        rack_name = ?,
        shelf_number = ?,
        position = ?,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        floor || existing.floor,
        rack_number || existing.rack_number,
        rack_name || existing.rack_name,
        parseInt(shelf_number) || existing.shelf_number,
        position || existing.position,
        id
      ]
    );

    const updatedBook = await getAsync(`SELECT * FROM books WHERE id = ?`, [id]);
    res.json({ message: 'Book location updated successfully', book: updatedBook });
  } catch (err) {
    console.error('Update location error:', err);
    res.status(500).json({ error: 'Failed to update book location.' });
  }
}

// Delete book record
async function deleteBook(req, res) {
  try {
    const { id } = req.params;
    const existing = await getAsync(`SELECT * FROM books WHERE id = ?`, [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Book not found.' });
    }

    await runAsync(`DELETE FROM books WHERE id = ?`, [id]);
    res.json({ message: `Book "${existing.title}" deleted successfully.` });
  } catch (err) {
    console.error('Delete book error:', err);
    res.status(500).json({ error: 'Failed to delete book record.' });
  }
}

module.exports = {
  searchBooks,
  getStats,
  getRacks,
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  updateAvailability,
  updateLocation,
  deleteBook
};
