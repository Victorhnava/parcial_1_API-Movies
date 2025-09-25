const express = require('express');
const {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  getMovieStats
} = require('../controllers/movieController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', getAllMovies);
router.get('/stats', getMovieStats);
router.get('/:id', getMovieById);
router.post('/', authenticate, authorize('admin'), createMovie);
router.put('/:id', authenticate, authorize('admin'), updateMovie);
router.delete('/:id', authenticate, authorize('admin'), deleteMovie);

module.exports = router;