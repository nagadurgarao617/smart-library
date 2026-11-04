const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/bookController');
const { verifyToken } = require('../middleware/auth');

// Public routes (for Student Portal & browsing)
router.get('/search', searchBooks);
router.get('/stats', getStats);
router.get('/racks', getRacks);
router.get('/', getAllBooks);
router.get('/:id', getBookById);

// Protected routes (for Staff Portal)
router.post('/', verifyToken, createBook);
router.put('/:id', verifyToken, updateBook);
router.patch('/:id/availability', verifyToken, updateAvailability);
router.patch('/:id/location', verifyToken, updateLocation);
router.delete('/:id', verifyToken, deleteBook);

module.exports = router;
