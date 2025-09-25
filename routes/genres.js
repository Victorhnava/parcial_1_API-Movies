const express = require('express');
const {
  getAllGenres,
  getGenreById,
  createGenre,
  updateGenre,
  deleteGenre
} = require('../controllers/genreController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', getAllGenres);
router.get('/:id', getGenreById);
router.post('/', authenticate, authorize('admin'), createGenre);
router.put('/:id', authenticate, authorize('admin'), updateGenre);
router.delete('/:id', authenticate, authorize('admin'), deleteGenre);

module.exports = router;